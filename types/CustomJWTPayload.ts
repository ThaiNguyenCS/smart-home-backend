import { JwtPayload } from "jsonwebtoken";

export interface CustomJwtPayload extends JwtPayload {
    id: string;
    displayName: string | null;
    username: string;
    role: string;
}
