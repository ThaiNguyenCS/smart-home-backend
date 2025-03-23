import UserError from "../errors/UserError";
import Floor from "../model/Floor.model";
import RealEstate from "../model/RealEstate.model";

class FloorRepository{
    async getAllFloorByEstate(realEstateId: string){
        const ob = await Floor.findAll({ where: { realEstateId } });
        return ob;
    }

    async addFloor(id: string, data: any) {
        console.log(data);
        if(!data.realEstateId){
            throw new UserError("Missing field");
        }
        const estate = await RealEstate.findOne({where: {id: data.realEstateId}})
        if(!estate){
            throw new Error("Estate not found");
        }
        const floor = {
            id: id,
            name: data.name,
            realEstateId: data.realEstateId
        }
        const createOb = await Floor.create(floor);
        return createOb;
    }

    async updateFloor(id:string, data: any) {
        const { name, realEstateId } = data;
        if (!id) {
            throw new UserError("Missing field");
        }
        const updateOb = Object.fromEntries(Object.entries({ name: name, realEstateId: realEstateId }).filter(([_, value]) => value !== undefined));
        const ob = await Floor.update(updateOb, { where: { id: id } });
        return ob;
    }

    async deleteFloor(id: string) {
        if(!id){
            throw new UserError("Missing field");
        }
        const removeOb = await Floor.destroy({ where: { id } });
        return removeOb;
    }
}
export default FloorRepository;