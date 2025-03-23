import FloorRepository from "../repository/FloorRepository";
import { generateUUID } from "../utils/idGenerator";

class FloorService {
    private floorRepo: FloorRepository;
    constructor(floorRepo: FloorRepository) {
        this.floorRepo = floorRepo;
    }

    async getAllFloorByEstate(estateId: string) {
        const ob = await this.floorRepo.getAllFloorByEstate(estateId);
        return ob;
    }

    async addFloor(data: any) {
        const id = generateUUID();
        const ob = await this.floorRepo.addFloor(id, data);
        return ob;
    }

    async updateFloor(id: string, data: any) {
        const ob = await this.floorRepo.updateFloor(id, data);
        return ob;
    }

    async deleteFloor(id: string) {
        const ob = await this.floorRepo.deleteFloor(id);
        return ob;
    }
}

export default FloorService;
