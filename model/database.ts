// @ts-nocheck
import { Sequelize } from "sequelize";
import { DB_CONFIG } from "../config/config";
console.log(DB_CONFIG);

const sequelize: Sequelize = new Sequelize({
    database: DB_CONFIG.database,
    username: DB_CONFIG.username,
    password: DB_CONFIG.password,
    host: DB_CONFIG.host,
    port: DB_CONFIG.port,
    dialect: "postgres",
    logging: true,
    dialectOptions:
        DB_CONFIG.ssl === "true"
            ? {
                  ssl: {
                      require: true,
                      rejectUnauthorized: false,
                  },
              }
            : {}, // Remove SSL options if SSL is disabled
});

export default sequelize;
