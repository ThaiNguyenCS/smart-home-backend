import { FindOptions } from "sequelize";
import UserError from "../errors/UserError";
import Floor from "../model/Floor.model";
import RealEstate from "../model/RealEstate.model";
import Room from "../model/Room.model";

class FloorRepository {
    async getAllFloorByEstate(realEstateId: string, filter: Partial<{ includeRoom: boolean }>) {
        const queryOptions: FindOptions = { where: {} };

        queryOptions.where = { ...queryOptions.where, realEstateId: realEstateId };
        if (filter.includeRoom) {
            queryOptions.include = [
                {
                    model: Room,
                    as: "rooms",
                    required: false,
                },
            ];
        }
        const ob = await Floor.findAll(queryOptions);
        return ob;
    }

    async addFloor(id: string, data: any) {
        console.log(data);
        if (!data.realEstateId) {
            throw new UserError("Missing field");
        }
        const estate = await RealEstate.findOne({ where: { id: data.realEstateId } });
        if (!estate) {
            throw new Error("Estate not found");
        }
        const floor = {
            id: id,
            name: data.name,
            realEstateId: data.realEstateId,
        };
        const createOb = await Floor.create(floor);
        return createOb;
    }

    async updateFloor(id: string, data: any) {
        const { name, realEstateId } = data;
        if (!id) {
            throw new UserError("Missing field");
        }
        const updateOb = Object.fromEntries(
            Object.entries({ name: name, realEstateId: realEstateId }).filter(([_, value]) => value !== undefined)
        );
        const ob = await Floor.update(updateOb, { where: { id: id } });
        return ob;
    }

    async deleteFloor(id: string) {
        if (!id) {
            throw new UserError("Missing field");
        }
        const removeOb = await Floor.destroy({ where: { id } });
        return removeOb;
    }
}
export default FloorRepository;
