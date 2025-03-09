import createHttpError from "http-errors";
import DeviceRepository from "../repository/DeviceRepository";
import { AddDeviceAttrQuery, RemoveDeviceAttrQuery } from "../types/device";
import UserError from "../errors/UserError";

class DeviceService {
    deviceRepository: DeviceRepository;
    constructor() {
        this.deviceRepository = new DeviceRepository();
    }

    async getAllDeviceFeeds() {
        //TODO: add condition
        let devices = await this.deviceRepository.getDeviceByCondition({ options: { attribute: { required: true } } });
        let result: any = [];
        devices.forEach((dev) => dev.attributes?.forEach((attr) => result.push(attr.feed)));
        console.log("device feeds:" + result);
        return result;
    }

    async getAllDevice(data: any) {
        const result = await this.deviceRepository.getDeviceByCondition(data);
        return result;
    }

    async addDevice(data: any) {
        const result = await this.deviceRepository.addDevice(data);
        return result;
    }

    async removeDevice(data: any) {
        const result = await this.deviceRepository.removeDevice(data);
        return result;
    }

    async updateDevice(data: any) {
        const { id, feed, name } = data;
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
            return result;
        } catch (error: any) {
            if (error instanceof UserError) {
                throw createHttpError(400, error.message);
            }
            throw createHttpError(500, error.message);
        }
    }

    async removeDeviceAttr(data: RemoveDeviceAttrQuery) {
        // delete device attribute from database
        const deletedAttr = await this.deviceRepository.getDeviceAttrById(data);
        if (deletedAttr) {
            const result = await this.deviceRepository.deleteDeviceAttr(data);
        } else {
            throw createHttpError(404, `Device attr ${data.attrId} not found`);
        }
        // notify the mqtt client to UNsubscribe to the deleted feed
    }

    async reloadDevices(data: any) {
        const { userId } = data;
    }
}

export default DeviceService;
