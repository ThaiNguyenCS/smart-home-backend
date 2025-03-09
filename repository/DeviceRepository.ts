import { where } from "sequelize";
import Device from "../model/Device.model";
import DeviceAttribute from "../model/DeviceAttribute.model";
import { generateUUID } from "../utils/idGenerator";
import createHttpError from "http-errors";
import { AddDeviceAttrQuery } from "../types/device";
import UserError from "../errors/UserError";

const validStatuses = ["on", "off"];
const validValueTypes = ["value", "status"];

class DeviceRepository {
    async addDevice(data: any) {
        const { feed, name, roomId = null } = data;
        const device = await Device.create({
            id: generateUUID(),
            name: name,
            roomId,
        });
        return device;
    }

    async removeDevice(data: any) {
        const { id } = data;
        if (!id) {
            throw new Error("Device ID is required");
        }
        const deleteNum = await Device.destroy({
            where: { id: id },
        });
        return deleteNum;
    }

    async updateDevice(data: any) {
        const { id, feed, name, roomId } = data;
        if (!id) {
            throw new Error("Device ID is required for updating.");
        }
        const update = Object.fromEntries(
            Object.entries({ feed, name, roomId }).filter(([_, value]) => value !== undefined)
        );
        const device = await Device.update(update, { where: { id: id } });
        return device;
    }

    async getDeviceById(data: any) {
        const { id, options } = data;
        console.log(data);
        const queryOptions: any = {};
        const includes = [];

        if (options.attribute) {
            includes.push({
                model: DeviceAttribute,
                as: "attributes",
                required: false,
            });
        }
        if (includes.length > 0) queryOptions.include = includes;
        return await Device.findByPk(id, queryOptions);
    }

    async getDeviceByCondition(data: any) {
        const { name, feed, options = {} } = data;

        const condition = Object.fromEntries(
            Object.entries({ feed, name }).filter(([_, value]) => value !== undefined)
        );
        const queryOptions: any = {};
        const includes = [];

        queryOptions.where = condition;
        if (options.attribute) {
            includes.push({
                model: DeviceAttribute,
                as: "attributes",
                required: false,
            });
        }
        if (includes.length > 0) queryOptions.include = includes;
        const devices = await Device.findAll(queryOptions);
        return devices;
    }

    async createDeviceAttr(data: AddDeviceAttrQuery) {
        const { deviceId, key, valueType, feed } = data;
        if (!deviceId || !key || !valueType || !feed) throw new UserError("Missing fields");
        if (!validValueTypes.includes(valueType)) {
            throw new UserError("Invalid valueType");
        }
        const newAttr: any = { id: generateUUID(), deviceId: deviceId, key: key, valueType: valueType, feed: feed };
        if (valueType === "status") newAttr.status = "off";
        else if (valueType === "value") newAttr.value = 0;
        await DeviceAttribute.create(newAttr);
    }

    async deleteDeviceAttr(data: any) {
        const { deviceId, key } = data;
        if (!deviceId || !key) throw new UserError("Missing fields");
        const result = await DeviceAttribute.destroy({
            where: { deviceId: deviceId, key: key },
        });
        return result;
    }

    // get all attrs of a device
    async getDeviceAttr(data: any) {
        const { deviceId } = data;
        const result = await DeviceAttribute.findAll({ where: { deviceId: deviceId } });
        return result;
    }

    // get a specific attr of a device by id
    async getDeviceAttrById(data: any): Promise<DeviceAttribute | null> {
        const { attrId } = data;
        const result = await DeviceAttribute.findByPk(attrId);
        return result;
    }

    async updateDeviceAttr(data: any) {
        const { attrId, status, value } = data;
        const attr = await this.getDeviceAttrById(attrId);
        if (attr) {
            const update: any = {};
            if (attr.valueType === "status") {
                if (status && validStatuses.includes(status)) {
                    update.status = status;
                } else {
                    throw new Error("status is missing or invalid");
                }
            } else {
                if (value) {
                    update.value = value;
                } else {
                    throw new Error("value is missing");
                }
            }
            await DeviceAttribute.update(update, {
                where: {
                    id: attrId,
                },
            });
        } else {
            throw new Error("attr not found");
        }
    }
}

export default DeviceRepository;
