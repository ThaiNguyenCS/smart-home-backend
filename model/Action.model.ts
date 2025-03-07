import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "./database";

interface ActionAttrs {
    id: string;
    deviceAttrId: string;
    value: string; //TODO: temp
}

// interface DeviceCreationAttrs extends Optional<DeviceAttrs, >;

interface ActionInstance extends Model<ActionAttrs, ActionAttrs>, ActionAttrs {}

const Action = sequelize.define<ActionInstance>("Action", {
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
        type: DataTypes.FLOAT,
        allowNull: false,
    },
});

export default Action;
