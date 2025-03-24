import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../middleware/authenticate.middleware";
import ScheduleService from "../service/schedule.service";

class ScheduleController {
    scheduleService: ScheduleService;
    constructor({ scheduleService }: { scheduleService: ScheduleService }) {
        this.scheduleService = scheduleService;
    }

    getAllSchedules = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const result = await this.scheduleService.findSchedulesV2({
                userId: req.user!.id,
            });
            res.status(200).send({ data: result, message: "Get schedules successfully" });
        } catch (error) {
            next(error);
        }
    };

    getSchedule = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const result = await this.scheduleService.findSchedule({
                userId: req.user!.id,
                scheduleId: req.params.id,
            });
            res.status(200).send({ data: result, message: "Get schedules successfully" });
        } catch (error) {
            next(error);
        }
    };

    addSchedule = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            await this.scheduleService.createScheduleV2({
                userId: req.user!.id,
                ...req.body,
            });
            res.status(201).send({ message: "Create schedule successfully" });
        } catch (error) {
            next(error);
        }
    };

    updateSchedule = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            await this.scheduleService.updateScheduleV2({
                userId: req.user!.id,
                scheduleId: req.params.id,
                ...req.body,
            });
            res.status(200).send({ message: "Update schedule successfully" });
        } catch (error) {
            next(error);
        }
    };

    deleteSchedule = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            await this.scheduleService.deleteSchedule({
                userId: req.user!.id,
                scheduleId: req.params.id,
            });
            res.status(200).send({ message: "Delete schedule successfully" });
        } catch (error) {
            next(error);
        }
    };
}

export default ScheduleController;
