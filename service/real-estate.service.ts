import RealEstateRepository from "../repository/RealEstateRepository";
import { generateUUID } from "../utils/idGenerator";

class RealEstateService {
    private realEstateRepo: RealEstateRepository;
    constructor(realEstateRepo: RealEstateRepository) {
        this.realEstateRepo = realEstateRepo;
    }

    async getAllByUser(userId: string) {
        const ob = await this.realEstateRepo.getAllEstateByUser(userId);
        return ob;
    }

    async getAllRoom(id: string) {
        const ob = await this.realEstateRepo.getAllRoom(id);
        return ob;
    }

    async createEstate(data: any) {
        const id = generateUUID();
        const ob = await this.realEstateRepo.createEstate(id, data);
        return ob;
    }

    async updateEstate(id: string, data: any) {
        const ob = await this.realEstateRepo.updateEstate(id, data);
        return ob;
    }

    async deleteEstate(id: string) {
        const ob = await this.realEstateRepo.deleteEstate(id);
        return ob;
    }
}

export default RealEstateService;
