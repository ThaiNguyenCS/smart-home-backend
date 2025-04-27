import { Op } from "sequelize"
import DeviceLog from "../model/DeviceLog.model"
import DeviceLogRepository from "../repository/DeviceLogRepository"
import DeviceAttribute from "../model/DeviceAttribute.model"
import Device from "../model/Device.model"
import Room from "../model/Room.model"
import Floor from "../model/Floor.model"
import RealEstate from "../model/RealEstate.model"
import RealEstateRepository from "../repository/RealEstateRepository"
import AppError from "../errors/AppError"
import { toDeviceDTO } from "../types/device-dto"

class StatService {
    private deviceLogRepository: DeviceLogRepository
    private realEstateRepo: RealEstateRepository
    DEFAULT_START_DATE = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    constructor({ deviceLogRepository, realEstateRepo }: { deviceLogRepository: DeviceLogRepository, realEstateRepo: RealEstateRepository }) {
        this.deviceLogRepository = deviceLogRepository
        this.realEstateRepo = realEstateRepo
    }
    getStats = async (userId: string, query: {
        realEstateId: string,
        startDate?: string,
        endDate?: string,
    }) => {
        // endDate default: today
        // startDate default: today -1
        const {
            startDate = this.DEFAULT_START_DATE,
            endDate = new Date(),
            realEstateId } = query

        const realEstate = await this.realEstateRepo.getRealEstate({ realEstateId })
        if (!realEstate) {
            throw new AppError(404, `This real estate does not exist`)
        }

        if (realEstate.userId !== userId) {
            throw new AppError(403, `This real estate does not belong to this user`)
        }

        // tim cac device attr cua userId này và lọc theo cái cần lấy log

        const logsByAttr = await DeviceAttribute.findAll({
            include: [
                {
                    model: Device,
                    where: {
                        userId: userId
                    },
                    as: "device",
                    attributes: ["id", "name"],
                    include: [
                        {
                            model: Room,
                            attributes: [],
                            as: "room",
                            include: [{
                                model: Floor,
                                attributes: [],
                                as: "floor",
                                include: [{
                                    model: RealEstate,
                                    attributes: [],
                                    as: "realEstate",
                                    where: {
                                        id: realEstateId
                                    }
                                }]
                            }]
                        },

                    ]
                },
                {
                    model: DeviceLog,
                    as: "logs",
                    attributes: ["createdAt", "value"],
                    where: {
                        createdAt: { [Op.and]: { [Op.gte]: new Date(startDate), [Op.lte]: new Date(endDate) } }
                    },
                    order: [["createdAt", "ASC"]],
                }
            ],
            where: {
                isPublisher: true
            },
            attributes: ["id", "key", "feed", "value"],
        })

        return logsByAttr

    }

    getPowerStats = async (userId: string, query: {
        realEstateId: string,
        startDate?: string,
        endDate?: string,
    }) => {
        // endDate default: today
        // startDate default: today -1
        const {
            startDate = this.DEFAULT_START_DATE,
            endDate = new Date(),
            realEstateId } = query

        const realEstate = await this.realEstateRepo.getRealEstate({ realEstateId })
        if (!realEstate) {
            throw new AppError(404, `This real estate does not exist`)
        }

        if (realEstate.userId !== userId) {
            throw new AppError(403, `This real estate does not belong to this user`)
        }

        // tim cac device attr cua userId này và lọc theo cái cần lấy log
        const devices = await Device.findAll({
            attributes: ["id", "name", "power"],
            include: [{
                model: DeviceAttribute,
                attributes: ["id"],
                as: "attributes",
                include: [
                    {
                        model: DeviceLog,
                        as: "logs",
                        attributes: ["createdAt", "value"],
                        where: {
                            createdAt: { [Op.and]: { [Op.gte]: new Date(startDate), [Op.lte]: new Date(endDate) } }
                        },
                        order: [["createdAt", "ASC"]],
                    },

                ],
                where: {
                    isPublisher: false
                }
            }, {
                model: Room,
                attributes: [],
                as: "room",
                include: [{
                    model: Floor,
                    attributes: [],
                    as: "floor",
                    include: [{
                        model: RealEstate,
                        attributes: [],
                        as: "realEstate",
                        where: {
                            id: realEstateId
                        }
                    }]
                }]
            },]
        })

        const ob: any = [];

        for (const device of devices) {
            let totalTimeMs = 0;
            let lastOnTime: Date | null = null;
            if (device.attributes && device.attributes.length > 0) {
                for (const log of device.attributes[0].logs) {
                    if (log.value == 1) {
                        lastOnTime = log.createdAt;
                    } else if (log.value == 0 && lastOnTime) {
                        totalTimeMs += new Date(log.createdAt).getTime() - new Date(lastOnTime).getTime();
                        lastOnTime = null;
                    }
                }
                if (lastOnTime) {
                    totalTimeMs += new Date().getTime() - new Date(lastOnTime).getTime();
                }
                const powerConsumption = device.power * totalTimeMs / 1000;
                ob.push({ device: toDeviceDTO(device), power: powerConsumption })
            }
        }
        return ob

    }
}

export default StatService