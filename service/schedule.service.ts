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
        const schedule = await this.scheduleRepository.findScheduleById({ id: scheduleId, includeDeviceInfo: true });
        console.log(schedule);
        if (!schedule) {
            throw createHttpError(404, `Schedule ${scheduleId} not found`);
        }

        if (!schedule.deviceAttribute || !schedule.deviceAttribute.device) {
            throw createHttpError(500, `Schedule ${scheduleId} does not have corresponding device`);
        }
        if (schedule.deviceAttribute.device.userId !== userId) {
            throw createHttpError(403, `Schedule ${scheduleId} does not belongs to this user`);
        }
    };

    createSchedule = async (data: {
        userId: string;
        time: string;
        deviceId: string;
        deviceAttrId: string;
        value: number;
        repeat: string;
        isActive?: boolean;
    }) => {
        const { userId, deviceId, time, deviceAttrId, value, repeat, isActive } = data;
        if (!deviceId || !deviceAttrId || value === undefined || !repeat || !time) {
            throw createHttpError(400, `Missing fields`);
        }
        if (!checkIfTimeValid(time)) {
            throw createHttpError(400, `Time must be in the form HH:mm:ss (24-hour format)`);
        }

        // check if user owns this device
        const device = await this.deviceRepository.getDeviceById({ id: deviceId, options: { attribute: {} } });
        if (!device) {
            throw createHttpError(404, `Device ${deviceId} not found`);
        }
        if (device.userId !== userId) {
            throw createHttpError(401, "Unauthorized");
        }
        if (!device.attributes) {
            throw createHttpError(404, `Device ${deviceId} does not have attribute ${deviceAttrId}`);
        }
        const attr = device.attributes.find((item) => item.id === deviceAttrId);
        if (!attr) {
            throw createHttpError(404, `Device ${deviceId} does not have attribute ${deviceAttrId}`);
        }

        await this.scheduleRepository.createSchedule({
            id: generateUUID(),
            deviceAttrId,
            repeat,
            time,
            isActive,
            value,
        });
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

    deleteSchedule = async (data: { userId: string; scheduleId: string; deviceId: string }) => {
        const { userId, scheduleId, deviceId } = data;
        if (!userId || !scheduleId || !deviceId) {
            throw createHttpError(400, "Missing fields");
        }
        console.log(data);

        const device = await this.deviceRepository.getDeviceById({ id: deviceId, options: { attribute: {} } });
        if (!device) {
            throw createHttpError(404, `Device ${deviceId} not found`);
        }
        if (device.userId !== userId) {
            throw createHttpError(401, "Unauthorized");
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

    findAllDueSchedules = async () => {
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
                    as: "deviceAttribute",
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
