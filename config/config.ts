import dotenv from "dotenv";
import path from "path";

if (process.env.NODE_ENV == "dev") {
    dotenv.config({ path: path.join(__dirname, "../", ".env.dev").toString() });
} else {
    dotenv.config({ path: path.join(__dirname, "../", ".env").toString() });
}

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export const PORT = process.env.PORT;


export const DB_CONFIG = {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
}