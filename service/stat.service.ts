import { Op } from "sequelize"
import DeviceLog from "../model/DeviceLog.model"
import DeviceLogRepository from "../repository/DeviceLogRepository"
import DeviceAttribute from "../model/DeviceAttribute.model"
import Device from "../model/Device.model"

class StatService {
    private deviceLogRepository: DeviceLogRepository
    constructor({ deviceLogRepository }: { deviceLogRepository: DeviceLogRepository }) {
        this.deviceLogRepository = deviceLogRepository
    }
    getStats = async (userId: string, query: {
        realEstateId: string,
        startDate: string,
        endDate: string,
    }) => {
        // endDate default: today
        // startDate default: today -1
        const { startDate, endDate, realEstateId } = query

        // tim cac device attr cua userId này và lọc theo cái cần lấy log
        let deviceAttrIds: string[] = []

        const attrs = await DeviceAttribute.findAll({
            include: [
                {
                    model: Device,
                    where: {
                        userId: userId
                    }
                }
            ],
            where: {
                isPublisher: true
            }
        })
        deviceAttrIds = attrs.map(attr => attr.getDataValue("id"))

        DeviceLog.findAll({
            where: {
                deviceAttrId: {
                    [Op.in]: deviceAttrIds
                },
                createdAt: { [Op.and]: { [Op.gte]: new Date(startDate), [Op.lte]: new Date(endDate) } }
            }
        })

    }
}

export default StatService