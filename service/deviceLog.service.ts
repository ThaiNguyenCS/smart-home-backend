import createHttpError from "http-errors";
import DeviceLogRepository from "../repository/DeviceLogRepository";
import { AddDeviceLogData, GetDeviceLogsQuery, UpdateDeviceLogData } from "../types/deviceLog";
import { runTransaction } from "../model/transactionManager";
import { generateUUID } from "../utils/idGenerator";

class DeviceLogService {
    deviceLogRepository: DeviceLogRepository;

    constructor(deviceLogRepository: DeviceLogRepository) {
        this.deviceLogRepository = deviceLogRepository;
    }

    async getAllDeviceLogs(data: GetDeviceLogsQuery) {
        return await this.deviceLogRepository.getDeviceLogsByCondition(data);
    }

    async addDeviceLog(data: AddDeviceLogData) {
        const {deviceAttrId, value, createdAt} = data;
        return runTransaction(async (transaction: any) => {
            const newLogId = generateUUID();
            const newLogData: AddDeviceLogData = {id: newLogId, deviceAttrId, value, createdAt};
            return this.deviceLogRepository.addDeviceLog(newLogData, transaction);
        });
    }


    async removeDeviceLog(logId: string) {
        const result = await this.deviceLogRepository.removeDeviceLog(logId);
        if (!result) {
            throw createHttpError(404, `Device log ${logId} not found`);
        }
        return result;
    }

}

export default DeviceLogService;
