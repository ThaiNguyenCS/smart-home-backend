import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "./database";

interface DeviceAttributeAttrs {
    id: string;
    deviceId: string;
    key: string;
    feed: string;
    value?: number;
    status?: "on" | "off";
    valueType: "status" | "value";
}

interface DeviceCreationAttrs extends Optional<DeviceAttributeAttrs, "value" | "status"> {}

class DeviceAttribute extends Model<DeviceAttributeAttrs, DeviceCreationAttrs> implements DeviceAttributeAttrs {
    public id!: string;
    public deviceId!: string;
    public key!: string;
    public value?: number;
    public feed!: string;
    public status?: "on" | "off";
    public valueType!: "status" | "value";

    // Example method for updating an attribute value
    public async updateStatus(newValue: string): Promise<void> {
        //TODO: check system rules to find if this device controls any others
        //TODO: check if newValue is valid
        const update: any = {};
        if (this.valueType === "status") update.status = newValue;
        else if (this.valueType === "value") {
            update.value = parseFloat(newValue);
        }
        await DeviceAttribute.update(update, { where: { feed: this.feed } });
    }
}

DeviceAttribute.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        feed: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
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
        sequelize,
        modelName: "DeviceAttribute",
        indexes: [{ unique: true, fields: ["deviceId", "key"] }],
    }
);
// DeviceAttribute.sync({alter: true})

export default DeviceAttribute;
