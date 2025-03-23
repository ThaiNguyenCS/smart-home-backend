import RoomRepository from "../repository/RoomRepository";
import { generateUUID } from "../utils/idGenerator";

class RoomService {
    private roomRepo: RoomRepository;
    constructor(roomRepo: RoomRepository) {
        this.roomRepo = roomRepo;
    }

    async getAllRoomInFloor(estateId: string) {
        const ob = await this.roomRepo.getAllRoomInFloor(estateId);
        return ob;
    }

    async addRoom(data: any) {
        const id = generateUUID();
        const ob = await this.roomRepo.addRoom(id, data);
        return ob;
    }

    async updateRoom(id: string, data: any) {
        const ob = await this.roomRepo.updateRoom(id, data);
        return ob;
    }

    async deleteRoom(id: string) {
        const ob = await this.roomRepo.deleteRoom(id);
        return ob;
    }
}

export default RoomService;
