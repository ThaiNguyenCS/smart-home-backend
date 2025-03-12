import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "./database";
import DeviceAttribute from "./DeviceAttribute.model";

interface ActionAttrs {
    id: string;
    deviceAttrId: string;
    value: number; //TODO: temp
    ruleId: string;
}

// interface DeviceCreationAttrs extends Optional<DeviceAttrs, >;

class Action extends Model<ActionAttrs, ActionAttrs> implements ActionAttrs {
    public id!: string;
    public deviceAttrId!: string;
    public value!: number; //TODO: temp
    public ruleId!: string;
    public deviceAttribute?: DeviceAttribute;
}

Action.init(
    {
        id: {
            primaryKey: true,
            type: DataTypes.STRING,
        },
        ruleId: {
            type: DataTypes.STRING,
            references: {
                key: "id",
                model: "SystemRules",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        deviceAttrId: {
            type: DataTypes.STRING,
            references: {
                key: "id",
                model: "DeviceAttributes",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        value: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    },
    { sequelize, modelName: "Actions", indexes: [{ fields: ["ruleId", "deviceAttrId"], unique: true }] }
);

// Action.sync({ alter: true });

export default Action;
