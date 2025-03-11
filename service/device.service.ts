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
        const { userId, name, roomId } = data;
        //TODO: Check if this device and roomId (if exists) belongs to this user
        const result = await this.deviceRepository.addDevice({ name, roomId });
        return result;
    }

    async removeDevice(data: any) {
        const result = await this.deviceRepository.removeDevice(data);
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
        //TODO: check if user has authorization
        let device = await this.deviceRepository.getDeviceById({
            id: data.deviceId,
            options: { attribute: { required: false } },
        });
        if (!device) throw createHttpError(404, `Device ${data.deviceId} not found`);
        device = device.toJSON();
        // delete device attribute from database
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
