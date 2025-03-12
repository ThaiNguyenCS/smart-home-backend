import { Request, Response } from "express";
import { authService } from "../service/auth.service";
import { HttpError } from "http-errors";

class AuthController {
    authService = authService;
    static async loginByUsernameAndPass(req: Request, res: Response) {
        try {
            console.log(req.body)
            const token = await authService.handleUserAndPassLogin({ ...req.body });
            res.status(200).send({ message: "login successfully", token: token });
        } catch (error: any) {
            console.log(error)
            res.status(error.status || 500).send({ message: error.message });
        }
    }

    static async register(req: Request, res: Response) {
        try {
            const token = await authService.registerUser(req.body);
            res.status(201).send({ message: "User registered successfully", token });
        } catch (error: any) {
            res.status(error.status || 500).send({ message: error.message });
        }
    }

    static async forgotPassword(req: Request, res: Response) {
        try {
            const response = await authService.handleForgotPassword(req.body.email);
            res.status(200).send(response);
        } catch (error: any) {
            res.status(error.status || 500).send({ message: error.message });
        }
    }
    
    static async resetPassword(req: Request, res: Response){
        try {
            const { username, newPassword } = req.body;
            const result = await authService.handleResetPassword(username, newPassword);
            res.status(200).send(result);
        } catch (error: any) {
            res.status(error.status || 500).send({ message: error.message });
        }
    }

    static async updatePassword(req: Request, res: Response): Promise<any> {
        try {
            const { userId, oldPassword, newPassword } = req.body;
    
            if (!userId || !oldPassword || !newPassword) {
                return res.status(400).send({ message: "Missing required data" });
            }
    
            const result = await authService.updateUserPassword(userId, oldPassword, newPassword);
    
            if (!result) {
                return res.status(400).send({ message: "Incorrect old password" });
            }
    
            return res.status(200).send({ message: "Password updated successfully" });
        } catch (error: any) {
            return res.status(error.status || 500).send({ message: error.message });
        }
    }
    
}

export default AuthController;