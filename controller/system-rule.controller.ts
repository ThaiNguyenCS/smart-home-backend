import { Request, Response } from "express";
import SystemRuleService from "../service/system-rule.service";
import createHttpError from "http-errors";

class SystemRuleController {
    systemRuleService: SystemRuleService;
    constructor(systemRuleService: SystemRuleService) {
        this.systemRuleService = systemRuleService;
    }
    getAllRules = async (req: Request, res: Response) => {};
    addRule = async (req: Request, res: Response) => {
        try {
            //TODO: userId
            await this.systemRuleService.addRule({ userId: "temp", ...req.body });
        } catch (error: any) {
            res.status(error.status || 500).send({ message: error.message });
        }
    };
    deleteRule = async (req: Request, res: Response) => {};
    updateRule = async (req: Request, res: Response) => {};
}

export default SystemRuleController;
