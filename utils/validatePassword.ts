import bcrypt from "bcrypt";

const SALT_OR_ROUND = 12;

export async function hashPassword(password: string) {
    const hashedPassword = await bcrypt.hash(password, SALT_OR_ROUND);
    return hashedPassword;
}

export async function comparePassword(password: string, encryptedPassword: string) {
    return await bcrypt.compare(password, encryptedPassword);
}
