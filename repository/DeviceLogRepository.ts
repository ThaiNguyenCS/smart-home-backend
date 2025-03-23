import DeviceLog from "../model/DeviceLog.model";
import { generateUUID } from "../utils/idGenerator";
import { AddDeviceLogData, UpdateDeviceLogData, GetDeviceLogsQuery } from "../types/deviceLog";
import UserError from "../errors/UserError";

class DeviceLogRepository {
    async addDeviceLog(data: AddDeviceLogData, transaction = null) {
        const { deviceAttrId, value, createdAt } = data;
        const queryOption: any = transaction ? { transaction } : {};
        return await DeviceLog.create({ 
            id: generateUUID(), 
            deviceAttrId, 
            value, 
            createdAt: createdAt || new Date() 
        }, queryOption);
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
        const condition = Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value !== undefined)
        );
        return await DeviceLog.findAll({ where: condition });
    }
    
    async getAllDeviceLog(data: any){
        const ob = await DeviceLog.findAll({ where: data.deviceAttrId})
        return ob;
    }
}

export default DeviceLogRepository;
