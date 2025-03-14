import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "./database";
import Floor from "./Floor.model";

interface RoomAttributes {
    id: number;
    name: string;
    floorId: number;
}

interface RoomCreationAttributes extends Optional<RoomAttributes, "id"> {}

interface RoomInstance
    extends Model<RoomAttributes, RoomCreationAttributes>,
        RoomAttributes {}

const Room = sequelize.define<RoomInstance>(
    "Room",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        floorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Floor,
                key: "id",
            },
        },
    },
    {}
);

export default Room;
