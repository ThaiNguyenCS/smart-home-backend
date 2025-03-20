import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "./database";

interface UserAttributes {
    id: string;
    username: string;
    password: string;
    email: string;
    phoneNumber: string;
    displayName?: string; // Optional field
    role: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "displayName" | "role"> {}

class User extends Model<UserAttributes, UserCreationAttributes> {
    public id!: string;
    public username!: string;
    public password!: string;
    public email!: string;
    public phoneNumber!: string;
    public displayName!: string | null; // Optional field
    public role!: string;
}

User.init(
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
                len: [10, 11],
            },
        },
        role: {
            type: DataTypes.ENUM("USER", "ADMIN"),
            allowNull: false,
            defaultValue: "USER",
        },
    },
    { sequelize }
);

// User.sync({ alter: true });

export default User;
