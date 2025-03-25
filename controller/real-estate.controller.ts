import { NextFunction, Request, Response } from "express";
import RealEstateService from "../service/real-estate.service";
import { AuthenticatedRequest } from "../middleware/authenticate.middleware";

class RealEstateController {
    private realEstateService: RealEstateService;

    constructor(realEstateService: RealEstateService) {
        this.realEstateService = realEstateService;
    }

    getAllEstateByUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const estates = await this.realEstateService.getAllByUser(req.user!.id);
            res.status(200).send({ message: "Get estates successfully", data: estates });
        } catch (error: any) {
            next(error);
        }
    };

    getAllRoom = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
        try {
            const { id } = req.params;
            const estate = await this.realEstateService.getAllRoom(id, { userId: req.user!.id });
            res.json({ message: "Successful", data: estate });
        } catch (error: any) {
            next(error);
        }
    };

    createEstate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
        try {
            const estate = await this.realEstateService.createEstate({ ...req.body, userId: req.user!.id });
            res.status(201).json(estate);
        } catch (error: any) {
            next(error);
        }
    };

    updateEstate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
        try {
            const { id } = req.params;
            await this.realEstateService.updateEstate(id, { ...req.body, userId: req.user!.id });
            res.json({ message: "Updated successfully" });
        } catch (error: any) {
            next(error);
        }
    };

    deleteEstate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
        try {
            const { id } = req.params;
            await this.realEstateService.deleteEstate({ id, userId: req.user!.id });
            res.json({ message: "Deleted successfully" });
        } catch (error: any) {
            next(error);
        }
    };
}

export default RealEstateController;
