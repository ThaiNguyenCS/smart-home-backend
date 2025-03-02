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
}

export default AuthController;
