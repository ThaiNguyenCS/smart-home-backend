import InvalidInputError from "./InvalidInputError";

export const handleError = (error: any) => {
    if (error instanceof InvalidInputError) {
        return { status: error.status, message: error.message };
    }

    return { status: 500, message: error.message };
};
