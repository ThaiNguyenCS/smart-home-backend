import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "./database";

interface RealEstateAttributes {
    id: string;
    name: string;
    address: string;
    ownerId: string;
}

interface RealEstateCreationAttributes extends Optional<RealEstateAttributes, "id"> {}

interface RealEstateInstance
    extends Model<RealEstateAttributes, RealEstateCreationAttributes>,
        RealEstateAttributes {}

const RealEstate = sequelize.define<RealEstateInstance>(
    "RealEstate",
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
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
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: "Users",
                key: "id"
            }
        },
    },
    {}
);

export default RealEstate;
