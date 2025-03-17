import { DestroyOptions, FindOptions, Op } from "sequelize";
import Schedule from "../model/Schedule.model"; // Adjust path as needed
import DeviceAttribute from "../model/DeviceAttribute.model";
import Device from "../model/Device.model";

class ScheduleRepository {
    // Create a new schedule
    async createSchedule(data: {
        id: string;
        time: string;
        deviceAttrId: string;
        value: number;
        repeat: string;
        isActive?: boolean;
    }) {
        return await Schedule.create(data);
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
        console.log(updates)
        await Schedule.update(updates, {
            where: { id: scheduleId },
        });
    }
}

export default ScheduleRepository;
