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
            type: DataTypes.STRING, 
            primaryKey: true,
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
            validate: {
                isEmail: true, 
            },
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true, 
            unique: true,
            validate: {
                isNumeric: true,
                len: [10,11],
            },
        },
    },
    {}
);

export default User;
