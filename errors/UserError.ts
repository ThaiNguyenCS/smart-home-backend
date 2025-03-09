class UserError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UserError"
    }

    // public static createMissingFieldsError()
    // {
    //     return new UserError("Missing fields")
    // }
}

export default UserError;
