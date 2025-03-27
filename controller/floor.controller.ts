import { Request, Response } from "express";
import FloorService from "../service/floor.service";

class FloorController {
    private floorService: FloorService;

    constructor(floorService: FloorService) {
        this.floorService = floorService;
    }

    async getAllFloorByEstate(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const floors = await this.floorService.getAllFloorByEstate(id, { ...req.query });
            res.json(floors);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async addFloor(req: Request, res: Response): Promise<any> {
        try {
            const floor = await this.floorService.addFloor(req.body);
            res.status(201).json(floor);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateFloor(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            await this.floorService.updateFloor(id, req.body);
            res.json({ message: "Updated successfully" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteFloor(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            await this.floorService.deleteFloor(id);
            res.json({ message: "Deleted successfully" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default FloorController;
