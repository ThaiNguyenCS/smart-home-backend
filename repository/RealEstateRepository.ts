import UserError from "../errors/UserError";
import RealEstate from "../model/RealEstate.model";
import User from "../model/User.model";
import Floor from "../model/Floor.model";
import Room from "../model/Room.model";
import Device from "../model/Device.model";
import { col, fn, literal } from "sequelize";

class RealEstateRepository {
    async getAllEstateByUser(userId: string) {
        const ob = await RealEstate.findAll({ where: { userId } });
        return ob;
    }

    async getRealEstate(data: { realEstateId: string }) {
        const { realEstateId } = data;
        const ob = await RealEstate.findOne({ where: { id: realEstateId } });
        return ob;
    }

    async getAllRoom(id: string) {
        const detail = await RealEstate.findByPk(id, {
            include: [
                {
                    model: Floor,
                    as: "floors",
                    required: false,
                    include: [
                        {
                            model: Room,
                            as: "rooms",
                            attributes: {
                                include: [
                                    [
                                        literal(`(
                                            SELECT CAST(COUNT(*) AS INTEGER )
                                            FROM "Devices" AS "devices"
                                            WHERE "devices"."roomId" = "floors->rooms"."id"
                                        )`),
                                        "deviceCount",
                                    ],
                                ],
                            },
                            include: [
                                {
                                    model: Device,
                                    as: "devices",
                                    attributes: [],
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        if (!detail) {
            throw new Error("Real estate not found");
        }
        detail.floors?.forEach((floor) => {
            let totalDeviceCount = 0;
            floor.rooms?.forEach((room) => {
                totalDeviceCount += room.getDataValue("deviceCount") || 0;
            });
            floor.setDataValue("deviceCount", totalDeviceCount);
        });
        return detail;
    }

    async createEstate(id: string, data: any) {
        if (!data.userId) {
            throw new UserError("Missing field");
        }
        const user = await User.findOne({ where: { id: data.userId } });
        if (!user) {
            throw new Error("User not found");
        }
        const estate = {
            id: id,
            name: data.name,
            userId: data.userId,
            description: data.description,
            address: data.address,
        };
        const createOb = await RealEstate.create(estate);
        return createOb;
    }

    async updateEstate(id: string, data: Partial<{ name: string; description: string; address: string }>) {
        const { name, description, address } = data;
        if (!id) {
            throw new Error("Missing field");
        }
        const updateOb = Object.fromEntries(
            Object.entries({ name: name, description: description, address: address }).filter(
                ([_, value]) => value !== undefined
            )
        );
        const ob = await RealEstate.update(updateOb, { where: { id: id } });
        return ob;
    }

    async deleteEstate(id: string) {
        if (!id) {
            throw new UserError("Missing field");
        }
        const removeOb = await RealEstate.destroy({ where: { id } });
        return removeOb;
    }
}

export default RealEstateRepository;
