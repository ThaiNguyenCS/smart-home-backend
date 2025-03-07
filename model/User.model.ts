import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "./database";

interface UserAttributes {
    id: string;
    username: string;
    password: string;
    email: string;
    phoneNumber: string;
    displayName?: string; // Optional field
}

interface UserCreationAttributes extends Optional<UserAttributes, "password" | "displayName"> {}

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
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    },
    {}
);

export default User;
