import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/authenticate.middleware";
import { handleError } from "../errors/ErrorHandler";
import NotificationService from "../service/notification.service";
import { NotificationCreateQuery } from "../types/notification";

class NotificationController {
    private notificationService: NotificationService;
    constructor(notificationService: NotificationService) {
        this.notificationService = notificationService;
    }

    createNotification = async (req: Request, res: Response) => {
        try {
            await this.notificationService.createNotification({ ...req.body });
            res.status(201).send({ message: "create notification successfully" });
        } catch (error) {
            const { message, status } = handleError(error);
            res.status(status).send({ message: message });
        }
    };

    getAllNotification = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const result = await this.notificationService.getAllNotifications({
                userId: req.user?.id,
                ...req.query,
            });
            res.send({ ...result, message: "success" });
        } catch (error) {
            const { message, status } = handleError(error);
            res.status(status).send({ message: message });
        }
    };

    acknowledgeNotification = async (req: AuthenticatedRequest, res: Response) => {
        try {
            await this.notificationService.acknowledgeNotifications({
                userId: req.user?.id,
                id: req.params.id,
                ...req.body,
            });
            res.send({ message: "ack message successfully" });
        } catch (error) {
            const { message, status } = handleError(error);
            res.status(status).send({ message: message });
        }
    };

    deleteNotification = async (req: AuthenticatedRequest, res: Response) => {
        try {
            await this.notificationService.deleteNotification({
                userId: req.user?.id,
                id: req.params.id,
            });
            res.status(200).send({ message: "Delete notification successfully" });
        } catch (error) {
            const { message, status } = handleError(error);
            res.status(status).send({ message: message });
        }
    };
}

export default NotificationController;
