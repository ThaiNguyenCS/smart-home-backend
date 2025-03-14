import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "./database";
import Action from "./Action.model";
import DeviceAttribute from "./DeviceAttribute.model";

interface SystemRuleAttrs {
    id: string;
    deviceAttrId: string;
    value: number;
    userId: string;
    compareType: string;
    isActive: boolean;
}

interface SystemRuleCreationAttrs extends Optional<SystemRuleAttrs, "isActive"> {}

class SystemRule extends Model<SystemRuleAttrs, SystemRuleCreationAttrs> implements SystemRuleAttrs {
    public id!: string;
    public deviceAttrId!: string;
    public value!: number;
    public userId!: string;
    public compareType!: string;
    public isActive!: boolean;
    public actions?: Action[];
    public deviceAttribute?: DeviceAttribute;
}

SystemRule.init(
    {
        id: {
            primaryKey: true,
            type: DataTypes.STRING,
        },
        userId: {
            type: DataTypes.STRING,
            references: {
                key: "id",
                model: "Users",
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
            allowNull: false,
        },
        value: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        compareType: {
            type: DataTypes.ENUM("gt", "lt", "eq", "lte", "gte"),
            allowNull: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        sequelize,
        modelName: "SystemRules",
    }
);

// SystemRule.sync({ alter: true });

export default SystemRule;
