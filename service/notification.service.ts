import createHttpError from "http-errors";
import { NotificationCreationAttrs } from "../model/Notification.model";
import NotificationRepository from "../repository/NotificationRepository";
import { NotificationCreateQuery } from "../types/notification";
import { generateUUID } from "../utils/idGenerator";

const validUnreadValues = ["true", "false"];

class NotificationService {
    private notificationRepo: NotificationRepository;
    constructor(notificationRepo: NotificationRepository) {
        this.notificationRepo = notificationRepo;
    }

    getAllNotifications = async (data: any) => {
        const { userId, sort } = data;
        let { limit = 20, page = 1, unread } = data;
        if (limit) limit = parseInt(limit);
        if (page) page = parseInt(page);
        let order: any = [];
        if (isNaN(limit) || limit < 0) {
            throw createHttpError(400, `limit's value invalid`);
        }
        if (isNaN(page) || page < 1) {
            throw createHttpError(400, `page's value invalid`);
        }
        if (unread !== undefined) {
            unread = (unread as string).toLowerCase();
            if (!validUnreadValues.includes(unread)) throw createHttpError(400, `unread's value: ${unread} invalid `);
            unread = unread === "true" ? true : false;
        }
        if (sort) {
            order = (sort as string).split(",").map((field) => {
                const [key, direction] = field.split(":");
                return [key, direction?.toUpperCase() === "ASC" ? "ASC" : "DESC"]; // default is DESC
            });
        }

        const result = await this.notificationRepo.getNotifications({
            userId,
            sorting: order,
            unread,
            limit: limit,
            page: page,
        });
        return { total: result.count, data: result.rows, limit: limit, page: page };
    };
    acknowledgeNotifications = async (data: any) => {
        const { id, status, userId } = data;
        console.log(data);
        if (!id || status === undefined || !userId) {
            throw createHttpError(400, "Missing fields");
        }
        const notification = await this.notificationRepo.getNotificationById(id);
        if (!notification) throw createHttpError(404, `Notification ${id} not found`);
        if (notification.userId !== userId) {
            throw createHttpError(401, `Unauthorized`);
        }
        await this.notificationRepo.updateNotification({ id: id, status: status });
    };
    deleteNotification = async (data: any) => {
        const { userId, id } = data;
        if (!id || !userId) {
            throw createHttpError(400, `Missing fields`);
        }
        const notification = await this.notificationRepo.getNotificationById(id);
        if (!notification) throw createHttpError(404, `Notification ${id} not found`);
        // check if this notification belongs to this user
        if (notification.userId !== userId) {
            throw createHttpError(401, `Unauthorized`);
        }
        await this.notificationRepo.deleteNotification({ id: id });
    };

    createNotification = async (data: NotificationCreateQuery) => {
        const { message, title, type, userId } = data;
        if (!message || !title || !type || !userId) {
            throw createHttpError(400, "Missing fields");
        }
        return await this.notificationRepo.createNotification({ id: generateUUID(), ...data });
    };
}

export default NotificationService;
