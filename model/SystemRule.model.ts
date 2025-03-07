import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "./database";

interface SystemRule {
    id: string;
    deviceAttrId: string;
    value: string;
    compareType: string;
}

// interface DeviceCreationAttrs extends Optional<DeviceAttrs, >;

interface SystemRuleInstance extends Model<SystemRule, SystemRule>, SystemRule {}

const SystemRule = sequelize.define<SystemRuleInstance>("SystemRule", {
    id: {
        primaryKey: true,
        type: DataTypes.STRING,
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
        type: DataTypes.STRING,
        allowNull: false,
    },
    compareType: {
        type: DataTypes.ENUM("greater", "less", "equal"),
        allowNull: false,
    },
});

export default SystemRule;
