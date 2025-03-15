import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "./database";
export interface NotificationAttrs {
    id: string;
    status: string;
    message: string;
    userId: string;
    type: string;
    title: string;
}

export interface NotificationCreationAttrs extends Optional<NotificationAttrs, "status"> {}
class Notification extends Model<NotificationAttrs, NotificationCreationAttrs> implements NotificationAttrs {
    public id!: string;
    public status!: string;
    public title!: string;
    public message!: string;
    public userId!: string;
    public type!: string;
}

Notification.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        status: {
            type: DataTypes.ENUM("ack", "unack"),
            defaultValue: "unack",
            validate: {
                isIn: {
                    args: [["ack", "unack"]],
                    msg: "Status must be either 'ack' or 'unack'",
                },
            },
        },
        title: {
            type: DataTypes.STRING(1000),
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        userId: {
            type: DataTypes.STRING,
            references: {
                model: "Users",
                key: "id",
            },
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM("alert", "notify"),
            defaultValue: "notify",
            validate: {
                isIn: {
                    args: [["alert", "notify"]],
                    msg: "type must be either 'alert' or 'notify'",
                },
            },
        },
    },
    { sequelize, modelName: "Notifications" }
);

export default Notification;
