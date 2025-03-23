import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "./database";
import RealEstate from "./Estate.model";

interface FloorAttributes {
    id:string;
    name: string;
    realEstateId: string;
}

interface FloorCreationAttributes extends Optional<FloorAttributes, "id"> {}

interface FloorInstance
    extends Model<FloorAttributes, FloorCreationAttributes>,
        FloorAttributes {}

const Floor = sequelize.define<FloorInstance>(
    "Floor",
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        realEstateId: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: RealEstate,
                key: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE", 
        },
    },
    {
        modelName: "Floor",
        timestamps: true
    }
);

export default Floor;
