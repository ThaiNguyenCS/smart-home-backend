import { Request, Response } from "express";
import DeviceLogService from "../service/deviceLog.service";

class DeviceLogController {
    deviceLogService: DeviceLogService;
    
    constructor(deviceLogService: DeviceLogService) {
        this.deviceLogService = deviceLogService;
    }

    async getAllLogs(req: Request, res: Response): Promise<any> {
        try {
            const result = await this.deviceLogService.getAllDeviceLogs(req.query);
            res.status(200).send({ message: "Get All Successfully", data: result });
        } catch (error: any) {
            console.error(error);
            res.status(error.status || 500).send({ message: error.message });
        }
    }
    

    async createLog(req: Request, res: Response): Promise<any> {
        try {
            const result = await this.deviceLogService.addDeviceLog(req.body);
            res.status(201).send({ message: "Create Successfully", data: result });
        } catch (error: any) {
            console.error(error);
            res.status(error.status || 500).send({ message: error.message });
        }
    }

    async deleteLog(req: Request, res: Response): Promise<any> {
        try {
            const result = await this.deviceLogService.removeDeviceLog(req.params.id);
            if (!result) {
                return res.status(404).send({ message: "Log is not exist" });
            }
            res.status(200).send({ message: "Delete Successfully" });
        } catch (error: any) {
            console.error(error);
            res.status(error.status || 500).send({ message: error.message });
        }
    }
}

export default DeviceLogController;
