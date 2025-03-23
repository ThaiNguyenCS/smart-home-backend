import UserError from "../errors/UserError";
import Room from "../model/Room.model";
import Floor from "../model/Floor.model";

class RoomRepository {
    async getAllRoomInFloor(floorId: string) {
        const ob = await Room.findAll({ where: { floorId } });
        return ob;
    }

    async addRoom(id: string, data: any) {
        if(!data.floorId){
            throw new UserError("Missing field");
        }
        const floor = await Floor.findOne({where: {id: data.floorId}})
        if(!floor){
            throw new Error("Floor not found");
        }
        const room = {
            id: id,
            name: data.name,
            floorId: data.floorId
        }
        const createOb = await Room.create(room);
        return createOb;
    }

    async updateRoom(id:string, data: any) {
        const { name, floorId } = data;
        if (!id) {
            throw new Error("Missing field");
        }
        const updateOb = Object.fromEntries(Object.entries({ name: name, floorId: floorId }).filter(([_, value]) => value !== undefined));
        const ob = await Room.update(updateOb, { where: { id: id } });
        return ob;
    }

    async deleteRoom(id: string) {
        if(!id){
            throw new UserError("Missing field");
        }
        const removeOb = await Room.destroy({ where: { id } });
        return removeOb;
    }
}

export default RoomRepository;
