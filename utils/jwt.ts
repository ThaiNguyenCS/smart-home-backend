import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config/config";
export const generateToken = (user : any): string => {
    return jwt.sign(
        { id: user.id, displayName: user.displayName, username: user.username }, // Payload
        JWT_SECRET_KEY as string, // Secret Key
        { expiresIn: "30d" } // Token expires in 1 hour
    );
};
