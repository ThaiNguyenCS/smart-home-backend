import { DestroyOptions, FindOptions, Op } from "sequelize";
import Schedule from "../model/Schedule.model"; // Adjust path as needed
import DeviceAttribute from "../model/DeviceAttribute.model";
import Device from "../model/Device.model";
import sequelize from "../model/database";
import { runTransaction } from "../model/transactionManager";
import ScheduleMapping from "../model/ScheduleMapping.model";
import Room from "../model/Room.model";

class ScheduleRepository {
    // Create a new schedule
    // async createSchedule(data: {
    //     id: string;
    //     time: string;
    //     deviceAttrId: string;
    //     value: number;
    //     repeat: string;
    //     isActive?: boolean;
    // }) {
    //     return await Schedule.create(data);
    // }

    async createScheduleV2(data: {
        id: string;
        userId: string;
        time: string;
        deviceAttrIds: string[];
        value: number;
        repeat: string;
        isActive?: boolean;
    }) {
        const { id, deviceAttrIds, time, value, repeat, isActive, userId } = data;
        await runTransaction(async (transaction: any) => {
            const records = [];
            for (const deviceAttrId of deviceAttrIds) {
                records.push({
                    scheduleId: id,
                    deviceAttrId: deviceAttrId,
                });
            }
            await Schedule.create(
                { id, time, value, userId, repeat, isActive },
                {
                    transaction: transaction,
                }
            );
            await ScheduleMapping.bulkCreate(records, { transaction: transaction });
        });
    }

    async findScheduleById(
        filters: Partial<{
            id: string;
            deviceAttrId: string;
            isActive: boolean;
            includeDeviceInfo: boolean;
        }>
    ) {
        const { id, deviceAttrId, isActive, includeDeviceInfo = false } = filters;
        const queryOptions: FindOptions = { where: {} };
        if (id) {
            queryOptions.where = { ...queryOptions.where, id: id };
        }
        if (includeDeviceInfo) {
            queryOptions.include = [
                {
                    model: DeviceAttribute,
                    as: "deviceAttribute",
                    attributes: ["id", "feed", "key", "deviceId", "value"],
                    required: true,
                    include: [{ model: Device, as: "device", required: true }],
                },
            ];
        }
        return await Schedule.findOne(queryOptions);
    }
    // Find schedules based on filters
    async findSchedules(
        filters: Partial<{
            id: string;
            deviceAttrId: string;
            isActive: boolean;
            deviceAttrIdList: string[];
            includeDeviceInfo: boolean;
        }>
    ) {
        const { id, deviceAttrId, isActive, deviceAttrIdList, includeDeviceInfo = false } = filters;
        const queryOptions: FindOptions = { where: {} };
        if (deviceAttrIdList) {
            queryOptions.where = { ...queryOptions.where, deviceAttrId: { [Op.in]: deviceAttrIdList } };
        }

        if (includeDeviceInfo) {
            queryOptions.include = [
                {
                    model: DeviceAttribute,
                    as: "deviceAttribute",
                    attributes: ["id", "feed", "key", "deviceId", "value"],
                    required: true,
                    include: [{ model: Device, as: "device", required: true }],
                },
            ];
        }
        return await Schedule.findAll(queryOptions);
    }

    // Find schedules based on filters
    async findSchedulesV2(
        filters: Partial<{
            id: string;
            userId: string;
            isActive: boolean;
            includeDeviceInfo: boolean;
        }>
    ) {
        const { id, userId, isActive, includeDeviceInfo = false } = filters;
        const queryOptions: FindOptions = { where: {} };

        if (includeDeviceInfo) {
            queryOptions.include = [
                {
                    model: DeviceAttribute,
                    attributes: ["id", "feed", "key", "deviceId", "value"],
                    required: false,
                    through: { attributes: [] },
                    include: [
                        {
                            model: Device,
                            as: "device",
                            required: true,
                            attributes: ["id", "name", "type", "userId"],
                            include: [{ model: Room, as: "room", required: false, attributes: ["id", "name"] }],
                        },
                    ],
                },
            ];
        }
        if (id) {
            queryOptions.where = { ...queryOptions.where, id: id };
        }
        if (userId) {
            queryOptions.where = { ...queryOptions.where, userId: userId };
        }
        if (isActive !== undefined) {
            queryOptions.where = { ...queryOptions.where, isActive: isActive };
        }
        return await Schedule.findAll(queryOptions);
    }

    // Delete a schedule by ID
    async deleteSchedule(scheduleId: string, transaction = null) {
        const deleteOptions: DestroyOptions = { where: { id: scheduleId } };
        if (transaction) {
            deleteOptions.transaction = transaction;
        }
        return await Schedule.destroy(deleteOptions);
    }

    async updateSchedule(
        scheduleId: string,
        updates: Partial<{ time: string; value: number; repeat: string; isActive: boolean; deviceAttrId: string }>
    ) {
        console.log(updates);
        await Schedule.update(updates, {
            where: { id: scheduleId },
        });
    }

    async updateScheduleV2(
        scheduleId: string,
        updates: Partial<{ time: string; value: number; repeat: string; isActive: boolean; deviceAttrIds: string[] }>
    ) {
        const { time, value, repeat, isActive, deviceAttrIds } = updates;
        const updateObject = Object.fromEntries(
            Object.entries({ time, value, repeat, isActive }).filter(([_, value]) => value !== undefined)
        );
        updateObject.lastActiveDate = new Date(Date.now() - 24*60*60*1000).toISOString();
        runTransaction(async (transaction: any) => {
            await Schedule.update(updateObject, {
                where: { id: scheduleId },
                transaction: transaction,
            });
            if (deviceAttrIds) {
                // First, remove existing mappings for this schedule
                await ScheduleMapping.destroy({
                    where: { scheduleId },
                    transaction,
                });

                // Then, add new mappings
                const newMappings = deviceAttrIds.map((deviceAttrId) => ({
                    scheduleId,
                    deviceAttrId,
                }));

                await ScheduleMapping.bulkCreate(newMappings, { transaction });
            }
        });
    }
}

export default ScheduleRepository;
