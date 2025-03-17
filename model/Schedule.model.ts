import { DataTypes, Model, NOW, Optional } from "sequelize";
import sequelize from "./database";
import DeviceAttribute from "./DeviceAttribute.model";

interface ScheduleAttrs {
    id: string;
    deviceAttrId: string;
    time: string;
    value: number;
    isActive: boolean;
    repeat: string;
    lastActiveDate: string;
}

interface ScheduleCreationAttrs extends Optional<ScheduleAttrs, "isActive" | "lastActiveDate"> {}

class Schedule extends Model<ScheduleAttrs, ScheduleCreationAttrs> implements ScheduleAttrs {
    public id!: string;
    public deviceAttrId!: string;
    public repeat!: string;
    public time!: string;
    public value!: number;
    public isActive!: boolean;
    public deviceAttribute?: DeviceAttribute;
    public lastActiveDate!: string;
}

Schedule.init(
    {
        id: {
            primaryKey: true,
            type: DataTypes.STRING,
        },
        time: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        deviceAttrId: {
            type: DataTypes.STRING,
            references: {
                key: "id",
                model: "DeviceAttributes",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            allowNull: false,
        },
        value: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        repeat: {
            type: DataTypes.STRING(7),
            validate: {
                isValidRepeat(value: string) {
                    if (!/^[01]{7}$/.test(value)) {
                        throw new Error("Repeat must be a 7-character string of only 0s and 1s");
                    }
                },
            },
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        lastActiveDate: {
            type: DataTypes.DATE,
            defaultValue: NOW,
        },
    },
    {
        sequelize,
        createdAt: false,
        updatedAt: false,
    }
);

// Schedule.sync({ alter: true });

export default Schedule;
