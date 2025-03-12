import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "./database";
import InvalidInputError from "../errors/InvalidInputError";

interface DeviceAttributeAttrs {
    id: string;
    deviceId: string;
    key: string;
    feed: string;
    value: number;
    isListener: boolean;
}

interface DeviceCreationAttrs extends Optional<DeviceAttributeAttrs, "value"> {}

class DeviceAttribute extends Model<DeviceAttributeAttrs, DeviceCreationAttrs> implements DeviceAttributeAttrs {
    public id!: string;
    public deviceId!: string;
    public key!: string;
    public value!: number;
    public feed!: string;
    public isListener!: boolean;

    // Example method for updating an attribute value
    public async updateStatus(newValue: string): Promise<void> {
        //TODO: check system rules to find if this device controls any others
        //TODO: check if newValue is valid
        const update: any = {};

        update.value = parseFloat(newValue);
        if (isNaN(update.value)) {
            throw new InvalidInputError(`${update.value} is not valid`);
        }
        await DeviceAttribute.update(update, { where: { feed: this.feed } });
        console.log("Update status for device attr successfully");
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
        isListener: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize,
        modelName: "DeviceAttribute",
        indexes: [{ unique: true, fields: ["deviceId", "key"] }],
    }
);
// DeviceAttribute.sync({ alter: true });

export default DeviceAttribute;
