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

    async addDevice(data: AddDeviceQuery) {
        const { userId, name, roomId, attrs } = data;

        await runTransaction(async (transaction: any) => {
            const newDeviceId = generateUUID();
            // add device
            const result = await this.deviceRepository.addDevice(
                { id: newDeviceId, name, roomId, userId },
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
                //TODO: notify device manager to load new device
            }
        });
    }

    async removeDevice(data: any) {
        const result = await this.deviceRepository.removeDevice(data);
        //TODO: notify device manager to unload deleted device
        return result;
    }

    async updateDevice(data: UpdateDeviceQuery) {
        const { deviceId, name, userId, roomId } = data;
        //TODO: Check if this device belongs to this user
        await this.deviceRepository.updateDevice({ deviceId, name, roomId });
    }

    async getDeviceById(data: any) {
        return await this.deviceRepository.getDeviceById(data);
    }

    async getDeviceByCondition(data: any) {
        const { name, feed } = data;
    }

    async createDeviceAttr(data: AddDeviceAttrQuery) {
        try {
            // add device attribute to database
            const result = await this.deviceRepository.createDeviceAttr(data);
            // notify the mqtt client to subscribe to the new feed
            await this.mqttService.subscribeToFeed(data.feed);
            //TODO: reload this attribute device's in device manager
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

    async reloadDevices(data: any) {
        const { userId } = data;
    }
}

export default DeviceService;
