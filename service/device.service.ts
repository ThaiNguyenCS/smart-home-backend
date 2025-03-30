import createHttpError from "http-errors";
import DeviceRepository from "../repository/DeviceRepository";
import {
    AddDeviceAttrQuery,
    AddDeviceQuery,
    RemoveDeviceAttrQuery,
    UpdateDeviceAttrQuery,
    UpdateDeviceQuery,
} from "../types/device";
import UserError from "../errors/UserError";
import MQTTService from "./mqtt.service";
import DeviceAttribute from "../model/DeviceAttribute.model";
import InvalidInputError from "../errors/InvalidInputError";
import { runTransaction } from "../model/transactionManager";
import { generateUUID } from "../utils/idGenerator";
import DeviceManager from "../temp_design_pattern/DeviceManager";

const PERMITTED_ATTR_VALUE = [0.0, 1.0];

class DeviceService {
    deviceRepository: DeviceRepository;
    mqttService: MQTTService;
    constructor(mqttService: MQTTService) {
        this.deviceRepository = new DeviceRepository();
        this.mqttService = mqttService;
    }

    async getAllDeviceFeeds() {
        //TODO: add condition
        let devices = await this.deviceRepository.getDeviceByCondition({ options: { attribute: { required: true } } });
        let result: any = [];
        devices.forEach((dev) => {
            let jsonDev = dev.toJSON();
            // assign attributes to Device object
            dev.attributes = (jsonDev.attributes || []).map((attr) => Object.assign(new DeviceAttribute(), attr));
            dev.attributes.forEach((attr) => {
                result.push(attr.feed);
            });
        });
        console.log("device feeds:" + result);
        return result;
    }

    async getAllDevice(data: any) {
        const result = await this.deviceRepository.getDeviceByCondition(data);
        return result;
    }

    async getAllDevicesForUser(data: { userId: string; roomId?: string; floorId?: string; estateId?: string }) {
        console.log(data);
        return await this.deviceRepository.getDevices(data);
    }

    async addDevice(data: AddDeviceQuery) {
        const { userId, name, roomId, attrs, type } = data;
        const newDeviceId = generateUUID();

        await runTransaction(async (transaction: any) => {
            // add device
            const result = await this.deviceRepository.addDevice(
                { id: newDeviceId, name, roomId, userId, type },
                transaction
            );
            // add device attrs (if included)
            if (attrs) {
                if (!Array.isArray(attrs)) throw createHttpError(400, "attrs must be an array of attr");
                console.log(attrs);
                const promises = [];
                for (let i = 0; i < attrs.length; i++) {
                    promises.push(
                        this.deviceRepository.createDeviceAttr({ ...attrs[i], deviceId: newDeviceId }, transaction)
                    );
                }
                await Promise.all(promises);
            }
        });
        //notify device manager to load new device
        const newDevice = await this.getDeviceById({ id: newDeviceId, options: { attribute: { required: true } } });
        DeviceManager.getInstance().addNewDevice(newDevice);

        // notify mqtt to subscribe to attrs of this new device
        if (newDevice.attributes) {
            const promises = [];
            for (const attr of newDevice.attributes) {
                promises.push(this.mqttService.subscribeToFeed(attr.feed));
            }
            await Promise.all(promises);
        }
    }

    async removeDevice(data: { id: string; userId: string }) {
        const { id } = data;
        const device = await this.getDeviceById({ id, options: { attribute: { required: true } } });
        if (!device) {
            throw createHttpError(404, `Device ${id} not found`);
        }
        const result = await this.deviceRepository.removeDevice({ deviceId: id }); // delete this device
        if (result !== 0) {
            DeviceManager.getInstance().removeDevice(id); // REMOVE DELETED FROM DEVICE MANAGER
            if (device.attributes) {
                const promises = [];
                for (const attr of device.attributes) {
                    promises.push(this.mqttService.unsubscribeFeed(attr.feed));
                }
                await Promise.all(promises); // UNSUBSCRIBE ALL DELETED FEEDS
            }
        }
        return result;
    }

    async updateDevice(data: UpdateDeviceQuery) {
        const { deviceId, name, userId, roomId } = data;
        //TODO: Check if this device belongs to this user
        const device = await this.deviceRepository.getDeviceById({ id: deviceId });
        if (!device) {
            throw createHttpError(404, `Device ${deviceId} not found`);
        }
        if (device.userId !== userId) {
            throw createHttpError(403, `This device does not belong to this user`);
        }

        await this.deviceRepository.updateDevice({ deviceId, name, roomId });
    }

    async getDeviceById(data: { id: string; options: any }) {
        return await this.deviceRepository.getDeviceById(data);
    }

    async createDeviceAttr(data: AddDeviceAttrQuery) {
        try {
            // add device attribute to database
            const result = await this.deviceRepository.createDeviceAttr(data);
            // notify the mqtt client to subscribe to the new feed
            await this.mqttService.subscribeToFeed(data.feed);
            // reload this attribute device's in device manager
            await DeviceManager.getInstance().reloadDevice(data.deviceId);

            return result;
        } catch (error: any) {
            if (error instanceof UserError) {
                throw createHttpError(400, error.message);
            }
            throw createHttpError(500, error.message);
        }
    }

    async removeDeviceAttr(data: RemoveDeviceAttrQuery) {
        //TODO: check if user has authorization
        let device = await this.deviceRepository.getDeviceById({
            id: data.deviceId,
            options: { attribute: { required: false } },
        });
        if (!device) throw createHttpError(404, `Device ${data.deviceId} not found`);
        device = device.toJSON();
        // delete device attribute from database
        const deletedAttr = device.attributes?.find((attr) => attr.id === data.attrId);
        if (deletedAttr) {
            const result = await this.deviceRepository.deleteDeviceAttr(data);
            // notify the mqtt client to UNsubscribe to the deleted feed
            await this.mqttService.unsubscribeFeed(deletedAttr.feed);
            // reload this attribute device's in device manager
            await DeviceManager.getInstance().reloadDevice(data.deviceId);
        } else {
            throw createHttpError(404, `Device attr ${data.attrId} does not belong to this device`);
        }
    }

    async updateDeviceAttr(data: UpdateDeviceAttrQuery) {
        const { userId } = data;
        let device = await this.deviceRepository.getDeviceById({
            id: data.deviceId,
            options: { attribute: { required: false } },
        });
        if (!device) throw createHttpError(404, `Device ${data.deviceId} not found`);
        if (device.userId !== userId) {
            throw createHttpError(401, `Unauthorized`);
        }

        const attr = device.attributes?.find((attr) => attr.id === data.attrId);
        if (attr) {
            try {
                const result = await this.deviceRepository.updateDeviceAttr(data);
            } catch (error: any) {
                if (error instanceof InvalidInputError) {
                    throw createHttpError(400, error.message);
                }
                throw createHttpError(500, error.message);
            }
            //TODO: if feed changed, take action
        } else {
            throw createHttpError(404, `Device attr ${data.attrId} does not belong to this device`);
        }
    }

    async controlDeviceAttr(data: { attrId: string; userId: string; deviceId: string; value: number }) {
        const { attrId, userId, deviceId, value } = data;
        const attr = await this.deviceRepository.getDeviceAttrById({ attrId: attrId });
        if (!PERMITTED_ATTR_VALUE.includes(value)) {
            throw createHttpError(400, `${value} is not a valid value`);
        }
        if (!attr) {
            throw createHttpError(404, `attr ${attrId} not found`);
        }
        if (attr.isPublisher) {
            throw createHttpError(403, `You cannot manipulate this attribute`);
        }
        if (!attr.device) {
            throw createHttpError(404, `Cannot find associated device of attribute ${attrId}`);
        }
        if (attr.device.id !== deviceId) {
            throw createHttpError(404, `attribute ${attrId} does not belong to device ${deviceId}`);
        }
        if (attr.device.userId !== userId) {
            throw createHttpError(403, `You cannot perform this action`);
        }
        await this.mqttService.publishMessage(attr.feed, value);
    }

    async reloadDevices(data: any) {
        const { userId } = data;
    }
}

export default DeviceService;
