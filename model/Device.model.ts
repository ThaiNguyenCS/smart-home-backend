import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "./database";


interface DeviceAttrs {
    id: string;
    feed: string;
    roomId: string;
    name: string;
}

// interface DeviceCreationAttrs extends Optional<DeviceAttrs, >;

interface DeviceInstance extends Model<DeviceAttrs, DeviceAttrs>, DeviceAttrs {}

const Device = sequelize.define<DeviceInstance>(
    "Device",
    {
        id: {
            primaryKey: true,
            type: DataTypes.STRING,
        },
        feed: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        roomId: {
            type: DataTypes.STRING,
            references: {
                key: "id",
                model: "Rooms",
            },
        },
    },
    { updatedAt: false }
);

// Device.sync({force: true})

export default Device;
