import { Request, Response } from "express";
import SystemRuleService from "../service/system-rule.service";
import createHttpError from "http-errors";
import { handleError } from "../errors/ErrorHandler";

class SystemRuleController {
    systemRuleService: SystemRuleService;
    constructor(systemRuleService: SystemRuleService) {
        this.systemRuleService = systemRuleService;
    }

    addActionToRule = async (req: Request, res: Response) => {
        try {
            //TODO: userId
            const result = await this.systemRuleService.addActionToRule({ userId: "testuser", ...req.body });
            res.status(200).send({ data: result, message: "Add new action successfully" });
        } catch (error: any) {
            const { status, message } = handleError(error);
            res.status(status).send({ message: message });
        }
    };

    getAllRules = async (req: Request, res: Response) => {
        try {
            //TODO: userId
            const result = await this.systemRuleService.getAllRules({ userId: "testuser" });
            res.status(200).send({ data: result, message: "successful" });
        } catch (error: any) {
            const { status, message } = handleError(error);
            res.status(status).send({ message: message });
        }
    };
    addRule = async (req: Request, res: Response) => {
        try {
            //TODO: userId
            await this.systemRuleService.addRule({ userId: "testuser", ...req.body });
            res.status(201).send({ message: "create rule successfully" });
        } catch (error: any) {
            const { status, message } = handleError(error);
            res.status(status).send({ message: message });
        }
    };
    deleteRule = async (req: Request, res: Response) => {};
    updateRule = async (req: Request, res: Response) => {};
}

export default SystemRuleController;
