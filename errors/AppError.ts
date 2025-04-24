class AppError extends Error {
    public readonly message: string;
    public readonly statusCode: number;

    constructor(statusCode = 400, message: string) {
        super(message); // Call the parent constructor with the message
        this.message = message;
        this.statusCode = statusCode;
    }
}

export default AppError;