import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./authenticate.middleware";

export function authorizeRoles(...roles: string[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        console.log("User:", req.user);
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ message: "Forbidden: You do not have access" });
        } else {
            next();
        }
    };
}
