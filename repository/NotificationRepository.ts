import { DestroyOptions, FindOptions, Order, UpdateOptions } from "sequelize";
import Notification, { NotificationCreationAttrs } from "../model/Notification.model";
import { NotificationQuery } from "../types/notification";

class NotificationRepository {
    getNotificationById = async (id: string) => {
        return await Notification.findByPk(id);
    };

    getNotifications = async (data: NotificationQuery, transaction = null) => {
        const { limit, page, userId, unread = false, sorting = [] } = data;
        const queryOptions: FindOptions = { where: {}, order: [] };
        if (transaction) {
            queryOptions.transaction = transaction;
        }
        // get only unread message
        if (unread) {
            queryOptions.where = { ...queryOptions.where, status: "unack" };
        }
        // apply sorting
        queryOptions.order = sorting;
        // apply limit
        queryOptions.limit = limit;
        // apply offset
        queryOptions.offset = (page! - 1) * limit!;
        queryOptions.where = { ...queryOptions.where, userId: userId };
        return await Notification.findAndCountAll(queryOptions);
    };
    updateNotification = async (data: any) => {
        const { id, status, message, title, type } = data;
        const updateObject = Object.fromEntries(
            Object.entries({ status, message, title, type }).filter(([_, value]) => value !== undefined)
        );
        const queryOption: UpdateOptions = { where: { id: id } };
        await Notification.update(updateObject, queryOption);
    };

    deleteNotification = async (data: any) => {
        const { id } = data;
        const queryOption: DestroyOptions = { where: { id: id } };
        await Notification.destroy(queryOption);
    };

    createNotification = async (data: NotificationCreationAttrs) => {
        const { id, message, title, userId, type } = data;
        const newNotification: NotificationCreationAttrs = {
            id: id,
            message: message,
            title: title,
            userId: userId,
            type: type,
        };
        await Notification.create(newNotification);
    };
}

export default NotificationRepository;
