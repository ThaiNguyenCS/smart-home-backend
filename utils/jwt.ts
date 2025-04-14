import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config/config";
import logger from "../logger/logger";
export const generateToken = (user: any): string => {
    return jwt.sign(
        { id: user.id, displayName: user.displayName, username: user.username, role: user.role }, // Payload
        JWT_SECRET_KEY as string, // Secret Key
        { expiresIn: "30d" } // Token expires in 1 hour
    );
};

export const verifyToken = (token: string): any => {
    try {
        return jwt.verify(token, JWT_SECRET_KEY as string);
    } catch (error) {
        logger.error(error);
        return null;
    }
}