import { NextFunction, Response } from "express"
import { AuthenticatedRequest } from "../middleware/authenticate.middleware"
import StatService from "../service/stat.service"
import { getStatSchema } from "../validators/statSchema"

class StatisticController {
    private statService: StatService

    constructor({ statService }: { statService: StatService }) {
        this.statService = statService
    }
    getStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const data = {
                realEstateId: req.query.realEstateId as string,
                startDate: req.query.startDate as string,
                endDate: req.query.endDate as string,
            }
            await getStatSchema.validateAsync(data)
            const result = await this.statService.getStats(req.user!.id, data)
            res.status(200).json({ message: "Get statistics successfully", data: result })
        } catch (error) {
            next(error)
        }
    }
}

export default StatisticController