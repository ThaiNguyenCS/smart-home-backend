import dotenv from "dotenv";
import path from "path";

if (process.env.NODE_ENV == "dev") {
    dotenv.config({ path: path.join(__dirname, "../", ".env.dev").toString() });
} else {
    dotenv.config({ path: path.join(__dirname, "../", ".env").toString() });
}

export const NODE_ENV = process.env.NODE_ENV;

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export const PORT = process.env.PORT;

const AIO_USERNAME = process.env.AIO_USERNAME;
const AIO_KEY = process.env.AIO_KEY;

export const AIO_CONFIG = {
    MQTT_URL: `mqtts://${AIO_USERNAME}:${AIO_KEY}@io.adafruit.com`,
    AIO_USERNAME,
    AIO_KEY,
};

export const LOG_LIFETIME = parseInt(process.env.LOG_LIFETIME!);

export const DB_CONFIG = {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: process.env.DB_SSL,
};
