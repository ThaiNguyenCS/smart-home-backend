import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "./database";
import Floor from "./Floor.model";
import Device from "./Device.model";

interface RoomAttributes {
    id: string;
    name: string;
    floorId: number;
    deviceCount?: number;
}

interface RoomCreationAttributes extends Optional<RoomAttributes, "id"> {}

class Room extends Model<RoomAttributes, RoomCreationAttributes> implements RoomAttributes {
    public id!: string;
    public name!: string;
    public floorId!: number;
    public devices!: Device[];
    public deviceCount!: number;
}

Room.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        floorId: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: Floor,
                key: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
    },
    {
        sequelize,
        timestamps: true,
    }
);

// Room.sync({ alter: true });

export default Room;
