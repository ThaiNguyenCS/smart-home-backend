import Device from "../model/Device.model";
import DeviceAttribute from "../model/DeviceAttribute.model";
import { generateUUID } from "../utils/idGenerator";
import {
    AddDeviceAttrData,
    AddDeviceData,
    RemoveDeviceData,
    UpdateDeviceAttrData,
    UpdateDeviceData,
} from "../types/device";
import UserError from "../errors/UserError";
import InvalidInputError from "../errors/InvalidInputError";
import { FindOptions } from "sequelize";

const validValueTypes = ["value", "status"];

class DeviceRepository {
    async addDevice(data: AddDeviceData, transaction = null) {
        const { id, name, roomId = null, userId } = data;
        const queryOption: any = {};
        if (transaction) {
            queryOption.transaction = transaction;
        }
        const device = await Device.create(
            {
                id: id,
                name: name,
                roomId,
                userId,
            },
            queryOption
        );
        return device;
    }

    async removeDevice(data: RemoveDeviceData) {
        const { deviceId } = data;
        if (!deviceId) {
            throw new Error("Device ID is required");
        }
        const deleteNum = await Device.destroy({
            where: { id: deviceId },
        });
        return deleteNum;
    }

    async updateDevice(data: UpdateDeviceData) {
        const { deviceId, name, roomId } = data;
        if (!deviceId) {
            throw new Error("Device ID is required for updating.");
        }
        const update = Object.fromEntries(Object.entries({ name, roomId }).filter(([_, value]) => value !== undefined));
        const device = await Device.update(update, { where: { id: deviceId } });
        return device;
    }

    async getDeviceById(data: { id: string; options: any }) {
        const { id, options } = data;
        console.log(data);
        const queryOptions: any = {};
        const includes = [];

        if (options?.attribute) {
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
        const { name, feed, options = {}, userId } = data;

        const condition = Object.fromEntries(
            Object.entries({ feed, name, userId }).filter(([_, value]) => value !== undefined)
        );
        const queryOptions: FindOptions = {};
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
        // console.log(devices[0].attributes);
        return devices;
    }

    async createDeviceAttr(data: AddDeviceAttrData, transaction = null) {
        const { deviceId, key, feed, isListener } = data;
        const queryOption: any = {};
        if (!deviceId || !key || !feed) throw new UserError("Missing fields");

        if (transaction) {
            queryOption.transaction = transaction;
        }
        const newAttr: any = Object.entries({ id: generateUUID(), deviceId, key, isListener, feed }).filter(
            ([_, value]) => value !== undefined
        );

        newAttr.value = 0;
        await DeviceAttribute.create(newAttr, queryOption);
    }

    async deleteDeviceAttr(data: any) {
        const { deviceId, key } = data;
        if (!deviceId && !key) throw new UserError("Missing fields");
        const queryOption: any = {};
        if (deviceId) {
            queryOption.where = { deviceId: deviceId };
        }

        if (key) {
            queryOption.where = { ...queryOption.where, key: key };
        }
        const result = await DeviceAttribute.destroy(queryOption);
        return result;
    }

    // get all attrs of a device
    async getDeviceAttr(data: any) {
        const { deviceId, options = { includeDevice: true } } = data;
        const result = await DeviceAttribute.findAll({ where: { deviceId: deviceId } });
        return result;
    }

    // get a specific attr of a device by id
    async getDeviceAttrById(data: any, transaction = null): Promise<DeviceAttribute | null> {
        const { attrId, options = { includeDevice: true } } = data;

        const queryOptions: FindOptions = {};
        if (options.includeDevice) {
            queryOptions.include = [
                {
                    model: Device,
                    as: "device",
                    foreignKey: "deviceId",
                },
            ];
        }
        if (transaction) {
            queryOptions.transaction = transaction;
        }

        const result = await DeviceAttribute.findByPk(attrId, queryOptions);
        return result;
    }

    async updateDeviceAttr(data: UpdateDeviceAttrData) {
        const { attrId, key, valueType } = data;
        const attr = await this.getDeviceAttrById({ attrId, options: { includeDevice: false } });
        if (attr) {
            if (valueType && !validValueTypes.includes(valueType)) {
                throw new InvalidInputError("valueType is not valid");
            }
            const update = Object.fromEntries(
                Object.entries({ key, valueType }).filter(([_, value]) => value !== undefined)
            );
            await attr.update(update);
        } else {
            throw new Error("attr not found");
        }
    }

    async getDeviceAttrs(options: any, transaction = null) {
        const { includeDevice = false } = options;
        const queryOptions: FindOptions = {};
        if (includeDevice) {
            queryOptions.include = [
                {
                    model: Device,
                    as: "device",
                    foreignKey: "deviceId",
                },
            ];
        }
        const result = await DeviceAttribute.findAll(queryOptions);
        return result;
    }
}

export default DeviceRepository;

// where
// include
