import { Request, Response } from "express";
import FloorService from "../service/floor.service";
import RoomService from "../service/room.service";

class RoomController {
    roomService: RoomService;
    
    constructor(roomService: RoomService) {
        this.roomService = roomService;
    }

    async getAllRoomInFloor(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const rooms = await this.roomService.getAllRoomInFloor(id);
            res.json(rooms);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }


    async addRoom(req: Request, res: Response): Promise<any> {
        try {
            const room = await this.roomService.addRoom(req.body);
            res.status(201).json(room);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateRoom(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            await this.roomService.updateRoom(id, req.body);
            res.json({ message: "Updated successfully" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteRoom(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            await this.roomService.deleteRoom(id);
            res.json({ message: "Deleted successfully" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default RoomController;
