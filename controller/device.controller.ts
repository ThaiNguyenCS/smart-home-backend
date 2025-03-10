import { Request, Response } from "express";
import DeviceService from "../service/device.service";

class DeviceController {
    deviceService: DeviceService;
    constructor(deviceService: DeviceService) {
        this.deviceService = deviceService;
        // console.log(this.deviceService)
    }

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
            const result = await this.deviceService.getAllDevice({});
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
