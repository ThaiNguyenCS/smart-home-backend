import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "./database";

interface RealEstateAttrs {
    id: string;
    name: string;
    userId: string;
    description: string;
    address: string;
}

interface RealEstateCreationAttrs extends Optional<RealEstateAttrs, "description" | "address"> {}

// have all the attrs from Model + user-defined attrs
interface RealEstateInstance extends Model<RealEstateAttrs, RealEstateCreationAttrs>, RealEstateAttrs {}

const RealEstate = sequelize.define<RealEstateInstance>(
    "RealEstate",
    {
        id: {
            primaryKey: true,
            type: DataTypes.STRING,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userId: {
            type: DataTypes.STRING,
            references: {
                key: "id",
                model: "Users",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE", 
        },
        description: {
            type: DataTypes.STRING,
        },
        address: {
            type: DataTypes.STRING,
        },
    },
    {}
);


export default RealEstate;
