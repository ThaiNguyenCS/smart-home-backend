import createHttpError from "http-errors";
import RealEstateRepository from "../repository/RealEstateRepository";
import { generateUUID } from "../utils/idGenerator";

class RealEstateService {
    private realEstateRepo: RealEstateRepository;
    constructor(realEstateRepo: RealEstateRepository) {
        this.realEstateRepo = realEstateRepo;
    }

    async _checkIfEstateBelongsToUser(id: string, userId: string) {
        const realEstate = await this.getRealEstate(id);
        if (!realEstate) throw createHttpError(404, `Real estate ${id} not found`);
        if (realEstate.userId !== userId) {
            throw createHttpError(403, `Forbidden`);
        }
    }

    async getAllByUser(userId: string) {
        const ob = await this.realEstateRepo.getAllEstateByUser(userId);
        return ob;
    }

    async getRealEstate(realEstateId: string) {
        const ob = await this.realEstateRepo.getRealEstate({ realEstateId: realEstateId });
        return ob;
    }

    async getAllRoom(id: string, data: { userId: string }) {
        const { userId } = data;
        const realEstate = await this.getRealEstate(id);
        if (!realEstate) throw createHttpError(404, `Real estate ${id} not found`);
        if (realEstate.userId !== userId) {
            throw createHttpError(403, `Forbidden`);
        }
        const ob = await this.realEstateRepo.getAllRoom(id);
        return ob;
    }

    async createEstate(data: any) {
        const id = generateUUID();
        const ob = await this.realEstateRepo.createEstate(id, data);
        return ob;
    }

    async updateEstate(id: string, data: any) {
        const { userId } = data;
        if (!userId) {
            throw createHttpError(401, "Unauthorized");
        }
        await this._checkIfEstateBelongsToUser(id, userId);
        const ob = await this.realEstateRepo.updateEstate(id, data);
        return ob;
    }

    async deleteEstate(data: { id: string; userId: string }) {
        const { id, userId } = data;
        if (!id || !userId) {
            throw createHttpError(400, "Missing fields");
        }
        await this._checkIfEstateBelongsToUser(id, userId);
        const ob = await this.realEstateRepo.deleteEstate(id);
        return ob;
    }
}

export default RealEstateService;
