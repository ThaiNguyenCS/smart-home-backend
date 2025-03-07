import { Request, Response } from "express";

class RealEstateController {
    reService = reService;
    static async loginByUsernameAndPass(req: Request, res: Response) {
        try {
            console.log(req.body);
            const token = await authService.handleUserAndPassLogin({ ...req.body });
            res.status(200).send({ message: "login successfully", token: token });
        } catch (error: any) {
            console.log(error);
            res.status(error.status || 500).send({ message: error.message });
        }
    }
}

export default RealEstateController;
