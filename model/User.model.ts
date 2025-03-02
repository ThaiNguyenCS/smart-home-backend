import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "./database";

interface UserAttributes {
    id: string;
    username: string;
    password: string;
    displayName?: string; // Optional field
}

interface UserCreationAttributes extends Optional<UserAttributes, "id" | "displayName"> {}

interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {}

const User = sequelize.define<UserInstance>(
    "User",
    {
        id: {
            primaryKey: true,
            type: DataTypes.STRING,
        },
        username: {
            unique: true,
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
        },
        displayName: {
            type: DataTypes.STRING,
        },
    },
    {}
);

export default User;
