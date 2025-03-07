import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "./database";

interface DeviceAttributeAttrs {
    id: string;
    deviceId: string;
    key: string;
    value: number;
    status: boolean;
    valueType: string;
}

interface DeviceCreationAttrs extends Optional<DeviceAttributeAttrs, "value" | "status"> {}

interface DeviceAttributeInstance extends Model<DeviceAttributeAttrs, DeviceCreationAttrs>, DeviceAttributeAttrs {}

const DeviceAttribute = sequelize.define<DeviceAttributeInstance>(
    "DeviceAttribute",
    {
        id: {
            primaryKey: true,
            type: DataTypes.STRING,
        },
        deviceId: {
            type: DataTypes.STRING,
            references: {
                key: "id",
                model: "Devices",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        key: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        value: {
            type: DataTypes.FLOAT,
        },
        valueType: {
            type: DataTypes.ENUM("status", "value"),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("on", "off"),
        },
    },
    {
        indexes: [{ unique: true, fields: ["deviceId", "key"] }],
    }
);

// DeviceAttribute.sync({alter: true})

export default DeviceAttribute;
