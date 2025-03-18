import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config/config";
import { CustomJwtPayload } from "../types/CustomJWTPayload";

export interface AuthenticatedRequest extends Request {
    user?: CustomJwtPayload;
}

export const validateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.split(" ")[1]; // discard the part Bearer
    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
    } else {
        try {
            const decoded = jwt.verify(token, JWT_SECRET_KEY as string) as CustomJwtPayload;
            req.user = decoded;
            console.log("req.user", req.user)
            next();
        } catch (error) {
            res.status(401).json({ message: "Invalid token" });
        }
    }
};
