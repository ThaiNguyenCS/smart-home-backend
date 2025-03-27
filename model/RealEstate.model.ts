import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "./database";
import Floor from "./Floor.model";

interface RealEstateAttrs {
    id: string;
    name: string;
    userId: string;
    description: string;
    address: string;
}

interface RealEstateCreationAttrs extends Optional<RealEstateAttrs, "description" | "address"> {}

// have all the attrs from Model + user-defined attrs
class RealEstate extends Model<RealEstateAttrs, RealEstateCreationAttrs> implements RealEstateAttrs {
    public floors?: Floor[];
    public id!: string;
    public name!: string;
    public userId!: string;
    public description!: string;
    public address!: string;
}

RealEstate.init(
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
    { sequelize }
);

// RealEstate.sync({alter: true})

export default RealEstate;
