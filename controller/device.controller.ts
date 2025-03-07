import { Request, Response } from "express";
import DeviceService from "../service/device.service";
import createHttpError from "http-errors";

class DeviceController {
    static deviceService = new DeviceService();

    static async getAllDevices(req: Request, res: Response) {
        try {
            // const user = req.user; //TODO: check authorization
            const result = await DeviceController.deviceService.getAllDevice({});
            res.status(200).send({ message: "Successfully", data: result });
        } catch (error: any) {
            console.error(error);
            // throw createError()
            res.status(error.status || 500).send({ message: error.message });
        }
    }

    static async addDevice(req: Request, res: Response) {
        try {
            // const user = req.user; //TODO: check authorization
            await DeviceController.deviceService.addDevice(req.body);
            res.status(201).send({ message: "Successfully" });
        } catch (error: any) {
            console.error(error);
            // throw createError()
            res.status(error.status || 500).send({ message: error.message });
        }
    }

    static async removeDevice(req: Request, res: Response) {
        try {
            // const user = req.user; //TODO: check authorization
            const id = req.params.id;
            const result = await DeviceController.deviceService.removeDevice({ id: id, userId: null });
            if (result == 0) {
                res.status(404).send({ message: `Device id ${id} not found` });
            } else {
                res.status(200).send({ message: "Successfully" });
            }
        } catch (error: any) {
            console.log(error);
            res.status(error.status || 500).send({ message: error.message });
        }
    }

    static async updateDevice(req: Request, res: Response) {
        try {
            res.status(200).send({ message: "Successfully" });
        } catch (error: any) {
            console.log(error);
            res.status(error.status || 500).send({ message: error.message });
        }
    }

    static async getDevice(req: Request, res: Response) {
        try {
            const data : any = {id: req.params.id, options: {}}
            if(req.query.includeAttr && req.query.includeAttr === "true")
            {
                data.options.attribute = {required: false}
            }
            const result = await DeviceController.deviceService.getDeviceById(data);
            res.status(200).send({ message: "Successful", data: result });
        } catch (error: any) {
            console.log(error);
            res.status(error.status || 500).send({ message: error.message });
        }
    }

    static async addDeviceAttr(req: Request, res: Response) {
        try {
            const result = await DeviceController.deviceService.createDeviceAttr({
                ...req.body,
                deviceId: req.params.id,
            });
            res.status(201).send({ message: "Successful", data: result });
        } catch (error: any) {
            console.log(error);
            res.status(error.status || 500).send({ message: error.message });
        }
    }
}

export default DeviceController;
