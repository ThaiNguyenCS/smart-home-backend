import { NextFunction, Response } from "express"
import { AuthenticatedRequest } from "../middleware/authenticate.middleware"

class StatisticController {
    getStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    }
}

export default StatisticController