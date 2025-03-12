class InvalidInputError extends Error {
    public status: number;
    constructor(message: string) {
        super(message);
        this.name = "InvalidInputError";
        this.status = 400;
    }
}

export default InvalidInputError;
