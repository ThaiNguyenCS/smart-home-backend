import { Request, Response } from "express";
import DeviceService from "../service/device.service";
import ScheduleService from "../service/schedule.service";
import { AuthenticatedRequest } from "../middleware/authenticate.middleware";
import { handleError } from "../errors/ErrorHandler";
import logger from "../logger/logger";

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
            logger.error(error);
            const { status, message } = handleError(error);
            res.status(status).send({ message: message });
        }
    };

    getDeviceSchedules = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const result = await this.scheduleService.findSchedules({ userId: req.user!.id, deviceId: req.params.id });
            res.status(200).send({ message: "Successful", data: result });
        } catch (error: any) {
            logger.error(error);
            const { status, message } = handleError(error);
            res.status(status).send({ message: message });
        }
    };

    // createDeviceSchedule = async (req: AuthenticatedRequest, res: Response) => {
    //     try {
    //         await this.scheduleService.createSchedule({ userId: req.user?.id, deviceId: req.params.id, ...req.body });
    //         res.status(201).send({ message: "Create schedule successfully" });
    //     } catch (error: any) {
    //         logger.error(error);
    //         const { status, message } = handleError(error);
    //         res.status(status).send({ message: message });
    //     }
    // };

    // reloadDevices = async (req: Request, res: Response) => {
    //     try {
    //         // const user = req.user
    //         const result = await this.deviceService.reloadDevices({}); //TODO: empty data
    //         res.status(201).send({ message: "Successful", data: result });
    //     } catch (error: any) {
    //            logger.error(error)
    //         const { status, message } = handleError(error);
    //         res.status(status).send({ message: message });
    //     }
    // };

    getAllDevices = async (req: AuthenticatedRequest, res: Response) => {
        try {
            // const user = req.user; //TODO: check authorization
            const result = await this.deviceService.getAllDevicesForUser({ ...req.query, userId: req.user!.id });
            res.status(200).send({ message: "Successful", data: result.rows, total: result.count });
        } catch (error: any) {
            logger.error(error);
            // throw createError()
            const { status, message } = handleError(error);
            res.status(status).send({ message: message });
        }
    };

    addDevice = async (req: Request, res: Response) => {
        try {
            await this.deviceService.addDevice({ ...req.body });
            res.status(201).send({ message: "Successful" });
        } catch (error: any) {
            logger.error(error);
            // throw createError()
            const { status, message } = handleError(error);
            res.status(status).send({ message: message });
        }
    };

    removeDevice = async (req: AuthenticatedRequest, res: Response) => {
        try {
            // const user = req.user; //TODO: check authorization
            const id = req.params.id;
            const result = await this.deviceService.removeDevice({ id: id, userId: req.user!.id });
            res.status(200).send({ message: "Delete device successfully" });
        } catch (error: any) {
            logger.error(error);
            const { status, message } = handleError(error);
            res.status(status).send({ message: message });
        }
    };

    updateDevice = async (req: Request, res: Response) => {
        try {
            // const user = req.user
            await this.deviceService.updateDevice({ deviceId: req.params.id, ...req.body });
            res.status(200).send({ message: "Successfully" });
        } catch (error: any) {
            logger.error(error);
            const { status, message } = handleError(error);
            res.status(status).send({ message: message });
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
            logger.error(error);
            const { status, message } = handleError(error);
            res.status(status).send({ message: message });
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
            logger.error(error);
            const { status, message } = handleError(error);
            res.status(status).send({ message: message });
        }
    };

    updateDeviceAttr = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const result = await this.deviceService.updateDeviceAttr({
                userId: req.user?.id,
                attrId: req.params.attrId,
                deviceId: req.params.id,
                ...req.body,
            });
            res.status(200).send({ message: "Successful", data: result });
        } catch (error: any) {
            logger.error(error);
            const { status, message } = handleError(error);
            res.status(status).send({ message: message });
        }
    };

    controlDeviceAttr = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const result = await this.deviceService.controlDeviceAttr({
                userId: req.user?.id,
                attrId: req.params.attrId,
                deviceId: req.params.id,
                ...req.body,
            });
            res.status(200).send({ message: "Successful" });
        } catch (error: any) {
            logger.error(error);
            const { status, message } = handleError(error);
            res.status(status).send({ message: message });
        }
    };

    deleteDeviceAttr = async (req: Request, res: Response) => {
        try {
            // const user = req.user;

            const result = await this.deviceService.removeDeviceAttr({
                deviceId: req.params.id,
                attrId: req.params.attrId,
            });
            res.status(201).send({ message: "Successful", data: result });
        } catch (error: any) {
            logger.error(error);
            const { status, message } = handleError(error);
            res.status(status).send({ message: message });
        }
    };
}

export default DeviceController;
