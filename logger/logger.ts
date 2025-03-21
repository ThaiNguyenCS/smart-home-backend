import { NODE_ENV } from "../config/config";
import winston from "winston";

const consoleLogFormat = winston.format.combine(
    NODE_ENV === "prod"
        ? winston.format.json()
        : winston.format.printf(({ timestamp, level, message }) => {
              const colorizer = winston.format.colorize().colorize;
              return colorizer(level, `${timestamp} [${level.toUpperCase()}]: ${message}`);
          })
);

const fileLogFormat = winston.format.combine(
    NODE_ENV === "prod"
        ? winston.format.json()
        : winston.format.printf(({ timestamp, level, message }) => {
              return `${timestamp} [${level.toUpperCase()}]: ${message}`;
          })
);

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" })),
    transports: [
        new winston.transports.Console({
            format: consoleLogFormat,
        }),
        new winston.transports.File({ filename: `${__dirname}/app.log`, format: fileLogFormat }),
    ],
});

export default logger;
