import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "./database";
import Floor from "./Floor.model";

interface RoomAttributes {
    id: string;
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
        modelName: "Room",
        timestamps: true
    }
);

export default Room;
