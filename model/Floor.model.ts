import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "./database";

interface FloorAttrs {
    id: string;
    num: number;
    name: string;
    realEstateId: string;
}

interface FloorCreationAttrs extends Optional<FloorAttrs, "num"> {}

// have all the attrs from Model + user-defined attrs
interface FloorInstance extends Model<FloorAttrs, FloorCreationAttrs>, FloorAttrs {}

const Floor = sequelize.define<FloorInstance>(
    "Floor",
    {
        id: {
            primaryKey: true,
            type: DataTypes.STRING,
        },
        num: {
            type: DataTypes.INTEGER,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        realEstateId: {
            type: DataTypes.STRING,
            references: {
                key: "id",
                model: "RealEstates",
            },
        },
    },
    { updatedAt: false }
);

export default Floor;
