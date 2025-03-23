import { Request, Response } from "express";
import RealEstateService from "../service/real-estate.service";

class RealEstateController {
    private realEstateService: RealEstateService;
    
    constructor(realEstateService: RealEstateService) {
        this.realEstateService = realEstateService;
    }

    async getAllEstateByUser(req: Request, res: Response): Promise<any> {
        try {
            const {id} = req.params;
            const estates = await this.realEstateService.getAllByUser(id);
            if(!estates) return {message: "No estates"}
            res.json(estates);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getAllRoom(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const estate = await this.realEstateService.getAllRoom(id);
            if (!estate) return res.status(404).json({ message: "Real estate not found" });
            res.json(estate);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async createEstate(req: Request, res: Response): Promise<any> {
        try {
            const estate = await this.realEstateService.createEstate(req.body);
            res.status(201).json(estate);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateEstate(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            await this.realEstateService.updateEstate(id, req.body);
            res.json({ message: "Updated successfully" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteEstate(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            await this.realEstateService.deleteEstate(id);
            res.json({ message: "Deleted successfully" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default RealEstateController;
