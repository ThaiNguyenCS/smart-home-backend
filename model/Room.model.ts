import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "./database";


interface RoomAttrs {
    id: string;
    name: string;
    floorId: string;
}

// interface RoomCreationAttrs extends Optional<RoomAttrs, >;

interface RoomInstance extends Model<RoomAttrs, RoomAttrs>, RoomAttrs {}

const Room = sequelize.define<RoomInstance>(
    "Room",
    {
        id: {
            primaryKey: true,
            type: DataTypes.STRING,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        floorId: {
            type: DataTypes.STRING,
            references: {
                key: "id",
                model: "Floors",
            },
        },
    },
    { updatedAt: false }
);


export default Room;
