import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "./database";
import RealEstate from "./RealEstate.model";
import Room from "./Room.model";

interface FloorAttributes {
    id: string;
    name: string;
    realEstateId: string;
    deviceCount?: number;
}

interface FloorCreationAttributes extends Optional<FloorAttributes, "id"> {}

class Floor extends Model<FloorAttributes, FloorCreationAttributes> implements FloorAttributes {
    public id!: string;
    public name!: string;
    public realEstateId!: string;
    public rooms?: Room[];
    public deviceCount!: number;
}

Floor.init(
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
        sequelize,
        modelName: "Floor",
        timestamps: true,
    }
);

export default Floor;
