import DeviceLog from "../model/DeviceLog.model";
import { generateUUID } from "../utils/idGenerator";
import { AddDeviceLogData, UpdateDeviceLogData, GetDeviceLogsQuery } from "../types/deviceLog";
import UserError from "../errors/UserError";
import { LOG_LIFETIME } from "../config/config";
import { Op } from "sequelize";

class DeviceLogRepository {
    async addDeviceLog(data: AddDeviceLogData, transaction = null) {
        const { id, deviceAttrId, value, createdAt } = data;
        const queryOption: any = transaction ? { transaction } : {};
        return await DeviceLog.create(
            {
                id: id,
                deviceAttrId,
                value,
                createdAt: createdAt || new Date(),
            },
            queryOption
        );
    }

    async cleanDeviceLog() {
        return await DeviceLog.destroy({
            where: {
                createdAt: {
                    [Op.lt]: new Date(Date.now() - LOG_LIFETIME * 24 * 60 * 60 * 1000), // Convert days to milliseconds
                },
            },
        });
    }

    async removeDeviceLog(logId: string) {
        if (!logId) {
            throw new UserError("Log ID is required");
        }
        return await DeviceLog.destroy({ where: { id: logId } });
    }

    async getDeviceLogById(logId: string) {
        if (!logId) {
            throw new UserError("Log ID is required");
        }
        return await DeviceLog.findByPk(logId);
    }

    async getDeviceLogsByCondition(data: GetDeviceLogsQuery) {
        const condition = Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== undefined));
        return await DeviceLog.findAll({ where: condition });
    }

    async getAllDeviceLog(data: any) {
        const ob = await DeviceLog.findAll({ where: data.deviceAttrId });
        return ob;
    }
}

export default DeviceLogRepository;
