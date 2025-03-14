import { Request, Response } from "express";
import SystemRuleService from "../service/system-rule.service";
import createHttpError from "http-errors";
import { handleError } from "../errors/ErrorHandler";
import { AuthenticatedRequest } from "../middleware/authenticate.middleware";

class SystemRuleController {
    systemRuleService: SystemRuleService;
    constructor(systemRuleService: SystemRuleService) {
        this.systemRuleService = systemRuleService;
    }

    addActionToRule = async (req: AuthenticatedRequest, res: Response) => {
        try {
            //TODO: userId
            const result = await this.systemRuleService.addActionToRule({ userId: req.user!.id, ...req.body });
            res.status(200).send({ data: result, message: "Add new action successfully" });
        } catch (error: any) {
            const { status, message } = handleError(error);
            res.status(status).send({ message: message });
        }
    };

    getAllRules = async (req: AuthenticatedRequest, res: Response) => {
        try {
            //TODO: userId
            const result = await this.systemRuleService.getAllRules({ userId: req.user!.id });
            res.status(200).send({ data: result, message: "successful" });
        } catch (error: any) {
            const { status, message } = handleError(error);
            res.status(status).send({ message: message });
        }
    };
    addRule = async (req: AuthenticatedRequest, res: Response) => {
        try {
            //TODO: userId
            await this.systemRuleService.addRule({ userId: req.user!.id, ...req.body });
            res.status(201).send({ message: "create rule successfully" });
        } catch (error: any) {
            const { status, message } = handleError(error);
            res.status(status).send({ message: message });
        }
    };
    deleteRule = async (req: AuthenticatedRequest, res: Response) => {
        try {
            await this.systemRuleService.deleteRule({ userId: req.user!.id, ruleId: req.params.id });
            res.status(200).send({ message: "Delete rule successfully" });
        } catch (error) {
            const { status, message } = handleError(error);
            res.status(status).send({ message: message });
        }
    };
    // updateRuleStatus = async (req: AuthenticatedRequest, res: Response) => {
    //     try {
    //         await this.systemRuleService.updateRuleStatus({
    //             userId: req.user!.id,
    //             ruleId: req.params.ruleId,
    //             ...req.body,
    //         });
    //         res.status(200).send({ message: "Update rule status successfully" });
    //     } catch (error) {
    //         const { status, message } = handleError(error);
    //         res.status(status).send({ message: message });
    //     }
    // };

    updateRule = async (req: AuthenticatedRequest, res: Response) => {
        try {
            await this.systemRuleService.updateRule({
                userId: req.user!.id,
                ruleId: req.params.ruleId,
                ...req.body,
            });
            res.status(200).send({ message: "Update rule successfully" });
        } catch (error) {
            const { status, message } = handleError(error);
            res.status(status).send({ message: message });
        }
    };

    updateRuleInfo = async (req: AuthenticatedRequest, res: Response) => {
        try {
            await this.systemRuleService.updateRuleInfo({
                userId: req.user!.id,
                ruleId: req.params.ruleId,
                ...req.body,
            });
            res.status(200).send({ message: "Update rule info successfully" });
        } catch (error) {
            const { status, message } = handleError(error);
            res.status(status).send({ message: message });
        }
    };
}

export default SystemRuleController;
