import createHttpError, { HttpError } from "http-errors"; // or "create-http-error"

export function createError(status: number, message?: string): HttpError {
    return createHttpError(status, message);
}
