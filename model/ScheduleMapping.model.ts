import { DataTypes, Model, NOW, Optional } from "sequelize";
import sequelize from "./database";

interface ScheduleMappingAttrs {
    scheduleId: string;
    deviceAttrId: string;
}

class ScheduleMapping extends Model<ScheduleMappingAttrs, ScheduleMappingAttrs> implements ScheduleMappingAttrs {
    public scheduleId!: string;
    public deviceAttrId!: string;
}

ScheduleMapping.init(
    {
        scheduleId: {
            type: DataTypes.STRING,
            references: {
                model: "Schedules",
            },
            primaryKey: true,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        deviceAttrId: {
            type: DataTypes.STRING,
            primaryKey: true,
            references: {
                model: "DeviceAttributes",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
    },
    {
        sequelize,
        createdAt: false,
        updatedAt: false,
        indexes: [
            {
                fields: ["scheduleId", "deviceAttrId"],
                unique: true,
            },
        ],
    }
);

// ScheduleMapping.sync({ alter: true });

export default ScheduleMapping;
