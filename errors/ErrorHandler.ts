import { Error, UniqueConstraintError } from "sequelize";
import InvalidInputError from "./InvalidInputError";
import { NextFunction, Request, Response } from "express";
import logger from "../logger/logger";

export const handleError = (error: any) => {
    if (error instanceof InvalidInputError) {
        return { status: error.status, message: error.message };
    }
    if (error instanceof UniqueConstraintError) {
        return { status: 409, message: error.original.message };
    }

    return { status: error.status || 500, message: error.message };
};

export const globalErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    let message = "";
    let status = 500;
    if (err instanceof InvalidInputError) {
        status = err.status;
        message = err.message;
    } else if (err instanceof UniqueConstraintError) {
        status = 409;
        message = err.original.message;
    } else {
        status = (err as any).status || 500;
        message = err.message;
    }
    logger.error(`[${req.method}] ${req.url} - ${message}`); // binding to winston logging. Change this
    res.status(status).send({
        message,
    });
};
