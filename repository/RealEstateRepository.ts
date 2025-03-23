import UserError from "../errors/UserError";
import RealEstate from "../model/RealEstate.model";
import User from "../model/User.model";
import Floor from "../model/Floor.model";
import Room from "../model/Room.model";

class RealEstateRepository {
    async getAllEstateByUser(userId: string) {
        const ob = await RealEstate.findAll({ where: { userId } });
        return ob;
    }

    async getAllRoom(id: string) {
        const rooms = await RealEstate.findByPk(id, {
            include: [
                {
                    model: Floor,
                    as: 'floors',
                    include: [
                        {
                            model: Room,
                            as: 'rooms',
                        },
                    ],
                },
            ],
        });

        if (!rooms) {
            throw new Error("Real estate not found");
        }
        return rooms
    }

    async createEstate(id: string, data: any) {
        if(!data.userId){
            throw new UserError("Missing field");
        }
        const user = await User.findOne({where: {id: data.userId}})
        if(!user){
            throw new Error("User not found");
        }
        const estate = {
            id: id,
            name: data.name,
            userId: data.userId,
            description: data.description,
            address: data.address
        }
        const createOb = await RealEstate.create(estate);
        return createOb;
    }

    async updateEstate(id:string, data: any) {
        const { name, userId, description, address } = data;
        if (!id) {
            throw new Error("Missing field");
        }
        const updateOb = Object.fromEntries(Object.entries({ name: name, userId: userId, description: description, address: address }).filter(([_, value]) => value !== undefined));
        const ob = await RealEstate.update(updateOb, { where: { id: id } });
        return ob;
    }

    async deleteEstate(id: string) {
        if(!id){
            throw new UserError("Missing field");
        }
        const removeOb = await RealEstate.destroy({ where: { id } });
        return removeOb;
    }
}

export default RealEstateRepository;
