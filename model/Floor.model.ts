import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "./database";
import RealEstate from "./Estate.model";

interface FloorAttributes {
    id: number;
    name: string;
    realEstateId: number;
}

interface FloorCreationAttributes extends Optional<FloorAttributes, "id"> {}

interface FloorInstance
    extends Model<FloorAttributes, FloorCreationAttributes>,
        FloorAttributes {}

const Floor = sequelize.define<FloorInstance>(
    "Floor",
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
        realEstateId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: RealEstate,
                key: "id",
            },
        },
    },
    {}
);

export default Floor;
