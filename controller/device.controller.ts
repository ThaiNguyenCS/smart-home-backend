import { Request, Response } from "express";
import DeviceService from "../service/device.service";
import ScheduleService from "../service/schedule.service";
import { AuthenticatedRequest } from "../middleware/authenticate.middleware";

class DeviceController {
    deviceService: DeviceService;
    scheduleService: ScheduleService;
    constructor({
        deviceService,
        scheduleService,
    }: {
        deviceService: DeviceService;
        scheduleService: ScheduleService;
    }) {
        this.deviceService = deviceService;
        this.scheduleService = scheduleService;
    }

    deleteDeviceSchedule = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const result = await this.scheduleService.deleteSchedule({
                userId: req.user!.id,
                deviceId: req.params.id,
                scheduleId: req.params.scheduleId,
            });
            res.status(200).send({ message: "Delete schedule successfully" });
        } catch (error: any) {
            console.log(error);
            res.status(error.status || 500).send({ message: error.message });
        }
    };

    updateDeviceSchedule = async (req: AuthenticatedRequest, res: Response) => {
        try {
            await this.scheduleService.updateSchedule({
                userId: req.user?.id,
                scheduleId: req.params.scheduleId,
                deviceId: req.params.id,
                ...req.body,
            });
            res.status(200).send({ message: "Successful" });
        } catch (error: any) {
            console.log(error);
            res.status(error.status || 500).send({ message: error.message });
        }
    };

    getDeviceSchedules = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const result = await this.scheduleService.findSchedules({ userId: req.user!.id, deviceId: req.params.id });
            res.status(200).send({ message: "Successful", data: result });
        } catch (error: any) {
            console.log(error);
            res.status(error.status || 500).send({ message: error.message });
        }
    };

    createDeviceSchedule = async (req: AuthenticatedRequest, res: Response) => {
        try {
            await this.scheduleService.createSchedule({ userId: req.user?.id, deviceId: req.params.id, ...req.body });
            res.status(201).send({ message: "Create schedule successfully" });
        } catch (error: any) {
            console.log(error);
            res.status(error.status || 500).send({ message: error.message });
        }
    };

    reloadDevices = async (req: Request, res: Response) => {
        try {
            // const user = req.user
            const result = await this.deviceService.reloadDevices({}); //TODO: empty data
            res.status(201).send({ message: "Successful", data: result });
        } catch (error: any) {
            console.log(error);
            res.status(error.status || 500).send({ message: error.message });
        }
    };

    getAllDevices = async (req: Request, res: Response) => {
        try {
            // const user = req.user; //TODO: check authorization
            const result = await this.deviceService.getAllDevice({ options: { attribute: {} } });
            res.status(200).send({ message: "Successfully", data: result });
        } catch (error: any) {
            console.error(error);
            // throw createError()
            res.status(error.status || 500).send({ message: error.message });
        }
    };

    addDevice = async (req: Request, res: Response) => {
        try {
            // const user = req.user; //TODO: check authorization
            await this.deviceService.addDevice({ userId: "temp", ...req.body }); //TODO: add userID
            res.status(201).send({ message: "Successfully" });
        } catch (error: any) {
            console.error(error);
            // throw createError()
            res.status(error.status || 500).send({ message: error.message });
        }
    };

    removeDevice = async (req: Request, res: Response) => {
        try {
            // const user = req.user; //TODO: check authorization
            const id = req.params.id;
            const result = await this.deviceService.removeDevice({ id: id, userId: null });
            if (result == 0) {
                res.status(404).send({ message: `Device id ${id} not found` });
            } else {
                res.status(200).send({ message: "Successfully" });
            }
        } catch (error: any) {
            console.log(error);
            res.status(error.status || 500).send({ message: error.message });
        }
    };

    updateDevice = async (req: Request, res: Response) => {
        try {
            // const user = req.user
            await this.deviceService.updateDevice({ deviceId: req.params.id, ...req.body });
            res.status(200).send({ message: "Successfully" });
        } catch (error: any) {
            console.error(error);
            res.status(error.status || 500).send({ message: error.message });
        }
    };

    getDevice = async (req: Request, res: Response) => {
        try {
            const data: any = { id: req.params.id, options: {} };
            if (req.query.includeAttr && req.query.includeAttr === "true") {
                data.options.attribute = { required: false };
            }
            const result = await this.deviceService.getDeviceById(data);
            res.status(200).send({ message: "Successful", data: result });
        } catch (error: any) {
            console.log(error);
            res.status(error.status || 500).send({ message: error.message });
        }
    };

    addDeviceAttr = async (req: Request, res: Response) => {
        try {
            const result = await this.deviceService.createDeviceAttr({
                ...req.body,
                deviceId: req.params.id,
            });
            res.status(201).send({ message: "Successful", data: result });
        } catch (error: any) {
            console.log(error);
            res.status(error.status || 500).send({ message: error.message });
        }
    };

    updateDeviceAttr = async (req: Request, res: Response) => {
        try {
            const result = await this.deviceService.updateDeviceAttr({
                userId: "temp",
                ...req.body,
                attrId: req.params.attrId,
                deviceId: req.params.id,
            });
            res.status(200).send({ message: "Successful", data: result });
        } catch (error: any) {
            console.log(error);
            res.status(error.status || 500).send({ message: error.message });
        }
    };

    deleteDeviceAttr = async (req: Request, res: Response) => {
        try {
            // const user = req.user;

            const result = await this.deviceService.removeDeviceAttr({
                userId: "temp", // TODO: TEMP
                deviceId: req.params.id,
                attrId: req.params.attrId,
            });
            res.status(201).send({ message: "Successful", data: result });
        } catch (error: any) {
            console.log(error);
            res.status(error.status || 500).send({ message: error.message });
        }
    };
}

export default DeviceController;
