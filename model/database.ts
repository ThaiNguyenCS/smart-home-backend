// @ts-nocheck
import { Sequelize } from "sequelize";
import { DB_CONFIG } from "../config/config";

const sequelize = new Sequelize({
    database: DB_CONFIG.database,
    username: DB_CONFIG.username,
    password: DB_CONFIG.password,
    port: DB_CONFIG.port,
    dialect: "postgres",
});

export default sequelize;
