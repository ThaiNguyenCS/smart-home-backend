class InvalidInputError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidInputError";
    }

    // public static createMissingFieldsError()
    // {
    //     return new UserError("Missing fields")
    // }
}

export default InvalidInputError;
