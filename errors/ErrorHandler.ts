import { Sequelize, UniqueConstraintError } from "sequelize";
import InvalidInputError from "./InvalidInputError";

export const handleError = (error: any) => {
    if (error instanceof InvalidInputError) {
        return { status: error.status, message: error.message };
    }
    if (error instanceof UniqueConstraintError) {
        return { status: 409, message: error.original.message };
    }

    return { status: error.status || 500, message: error.message };
};
