import createHttpError from "http-errors";
import DeviceRepository from "../repository/DeviceRepository";
import ScheduleRepository from "../repository/ScheduleRepository";
import { generateUUID } from "../utils/idGenerator";
import { checkIfTimeValid, getDateOnly, getTimeOnly } from "../utils/date-time-formatter";
import Schedule from "../model/Schedule.model";
import { col, fn, literal, Op, Sequelize } from "sequelize";
import DeviceAttribute from "../model/DeviceAttribute.model";

const LOCAL_TIME_ZONE = "+07:00";

class ScheduleService {
    private scheduleRepository: ScheduleRepository;
    private deviceRepository: DeviceRepository;
    constructor({
        scheduleRepository,
        deviceRepository,
    }: {
        scheduleRepository: ScheduleRepository;
        deviceRepository: DeviceRepository;
    }) {
        this.scheduleRepository = scheduleRepository;
        this.deviceRepository = deviceRepository;
    }

    _checkIfScheduleBelongsToUser = async (scheduleId: string, userId: string) => {
        const schedule = await this.scheduleRepository.findScheduleById({ id: scheduleId, includeDeviceInfo: false });
        if (!schedule) {
            throw createHttpError(404, `Schedule ${scheduleId} not found`);
        }
        if (schedule.userId !== userId) {
            throw createHttpError(403, `Schedule ${scheduleId} does not belongs to this user`);
        }
    };

    createScheduleV2 = async (data: {
        userId: string;
        time: string;
        deviceAttrIds: string[];
        value: number;
        repeat: string;
        isActive?: boolean;
    }) => {
        const { userId, time, deviceAttrIds, value, repeat, isActive } = data;
        if (!deviceAttrIds || value === undefined || !repeat || !time) {
            throw createHttpError(400, `Missing fields`);
        }
        if (!checkIfTimeValid(time)) {
            throw createHttpError(400, `Time must be in the form HH:mm:ss (24-hour format)`);
        }
        // check if all deviceAttrId belongs to this user
        for (const deviceAttrId of deviceAttrIds) {
            const attr = await this.deviceRepository.getDeviceAttrById({
                attrId: deviceAttrId,
            });
            if (!attr) throw createHttpError(404, `Device Attribute ${deviceAttrId} not found`);
            if (attr.device?.userId !== userId) {
                throw createHttpError(404, `Device Attribute ${deviceAttrId} does not belong to this user`);
            }
        }

        await this.scheduleRepository.createScheduleV2({ id: generateUUID(), ...data });
    };

    findSchedules = async (data: { userId: string; deviceId: string }) => {
        const { userId, deviceId } = data;
        if (!userId || !deviceId) {
            throw createHttpError(400, "Missing fields");
        }

        const device = await this.deviceRepository.getDeviceById({ id: deviceId, options: { attribute: {} } });
        if (!device) {
            throw createHttpError(404, `Device ${deviceId} not found`);
        }
        if (device.userId !== userId) {
            throw createHttpError(401, "Unauthorized");
        }

        const deviceAttrIds = device.attributes?.map((item) => item.id) || [];

        const schedules = await this.scheduleRepository.findSchedules({
            deviceAttrIdList: deviceAttrIds,
            includeDeviceInfo: true,
        });
        return schedules;
    };

    findSchedule = async (data: { userId: string; scheduleId: string }) => {
        const { userId, scheduleId } = data;
        if (!userId || !scheduleId) {
            throw createHttpError(400, "Missing fields");
        }
        const schedules = await this.scheduleRepository.findSchedulesV2({
            id: scheduleId,
            userId: userId,
            includeDeviceInfo: true,
        });
        if (schedules.length > 0) return schedules[0];
        throw createHttpError(404, `Schedule ${scheduleId} not found`);
    };

    findSchedulesV2 = async (data: { userId: string }) => {
        const { userId } = data;
        if (!userId) {
            throw createHttpError(400, "Missing fields");
        }

        const schedules = await this.scheduleRepository.findSchedulesV2({
            userId: userId,
            includeDeviceInfo: true,
        });
        return schedules;
    };

    deleteSchedule = async (data: { userId: string; scheduleId: string }) => {
        const { userId, scheduleId } = data;
        if (!userId || !scheduleId) {
            throw createHttpError(400, "Missing fields");
        }
        await this._checkIfScheduleBelongsToUser(scheduleId, userId);
        await this.scheduleRepository.deleteSchedule(scheduleId);
    };

    updateSchedule = async (data: {
        userId: string;
        scheduleId: string;
        deviceId: string;
        value?: number;
        time?: string;
        repeat?: string;
        isActive?: boolean;
        deviceAttrId?: string;
    }) => {
        const { userId, scheduleId, deviceId, value, time, repeat, isActive, deviceAttrId } = data;
        if (!userId || !scheduleId || !deviceId) {
            throw createHttpError(400, "Missing fields");
        }

        const device = await this.deviceRepository.getDeviceById({ id: deviceId, options: { attribute: {} } });
        if (!device) {
            throw createHttpError(404, `Device ${deviceId} not found`);
        }
        if (device.userId !== userId) {
            throw createHttpError(401, "Unauthorized");
        }

        if (!device.attributes) {
            throw createHttpError(404, `Device ${deviceId} does not have any attributes`);
        }

        // if new deviceAttrId is specified, check whether it belongs this device
        if (deviceAttrId) {
            const attr = device.attributes.find((item) => item.id === deviceAttrId);
            if (!attr) {
                throw createHttpError(404, `Device ${deviceId} does not have attribute ${deviceAttrId}`);
            }
        }

        await this._checkIfScheduleBelongsToUser(scheduleId, userId);
        await this.scheduleRepository.updateSchedule(scheduleId, { time, value, repeat, isActive, deviceAttrId });
    };

    updateScheduleV2 = async (data: {
        userId: string;
        scheduleId: string;
        value?: number;
        time?: string;
        repeat?: string;
        isActive?: boolean;
        deviceAttrIds?: string[];
    }) => {
        const { userId, scheduleId, value, time, repeat, isActive, deviceAttrIds } = data;
        if (!userId || !scheduleId) {
            throw createHttpError(400, "Missing fields");
        }
        await this._checkIfScheduleBelongsToUser(scheduleId, userId);
        if (deviceAttrIds) {
            // check if all deviceAttrId belongs to this user
            for (const deviceAttrId of deviceAttrIds) {
                const attr = await this.deviceRepository.getDeviceAttrById({
                    attrId: deviceAttrId,
                });
                if (!attr) throw createHttpError(404, `Device Attribute ${deviceAttrId} not found`);
                if (attr.device?.userId !== userId) {
                    throw createHttpError(404, `Device Attribute ${deviceAttrId} does not belong to this user`);
                }
            }
        }
        await this.scheduleRepository.updateScheduleV2(scheduleId, { time, value, repeat, isActive, deviceAttrIds });
    };

    findAllDueSchedulesV2 = async () => {
        const now = new Date(Date.now());
        const todayIndex = (now.getDay() + 6) % 7; // Convert to 0 = Monday, 6 = Sunday
        const currentTime = getTimeOnly(now);
        const today = getDateOnly(now);
        const todayBitmask = 64 >> todayIndex;
        const dueSchedules = await Schedule.findAll({
            where: {
                isActive: true, // only get active schedule
                [Op.and]: [
                    Sequelize.where(
                        fn("DATE", literal(`"lastActiveDate" AT TIME ZONE 'UTC' AT TIME ZONE '${LOCAL_TIME_ZONE}'`)),
                        "!=",
                        today
                    ), // ignore already active ones
                    Sequelize.literal(`CAST("repeat" AS bit(7))::int & ${todayBitmask} > 0`),
                ],
                time: { [Op.lte]: currentTime },
            },
            include: [
                {
                    model: DeviceAttribute,
                    attributes: ["id", "feed", "value"],
                    through: { attributes: [] },
                },
            ],
        });
        return dueSchedules;
    };

    updateLastActiveDate = async (scheduleIds: string[]) => {
        await Schedule.update(
            { lastActiveDate: new Date().toISOString() },
            {
                where: {
                    id: {
                        [Op.in]: scheduleIds,
                    },
                },
            }
        );
    };
}

export default ScheduleService;
