import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "./database";

interface RealEstateAttributes {
    id: number;
    name: string;
    address: string;
    ownerId: number;
}

interface RealEstateCreationAttributes extends Optional<RealEstateAttributes, "id"> {}

interface RealEstateInstance
    extends Model<RealEstateAttributes, RealEstateCreationAttributes>,
        RealEstateAttributes {}

const RealEstate = sequelize.define<RealEstateInstance>(
    "RealEstate",
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
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ownerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {}
);

export default RealEstate;
