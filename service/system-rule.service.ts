import createHttpError from "http-errors";
import { ActionAddData, SystemRuleAddQuery, SystemRuleViewQuery } from "../types/system-rule";
import DeviceRepository from "../repository/DeviceRepository";
import SystemRuleRepository from "../repository/SystemRuleRepository";
import ActionRepository from "../repository/ActionRepository";
import { runTransaction } from "../model/transactionManager";
import { generateUUID } from "../utils/idGenerator";
import SystemRule from "../model/SystemRule.model";
class SystemRuleService {
    private deviceRepository: DeviceRepository;
    private systemRuleRepository: SystemRuleRepository;
    private actionRepository: ActionRepository;
    constructor({ deviceRepository, systemRuleRepository, actionRepository }: any) {
        this.deviceRepository = deviceRepository;
        this.systemRuleRepository = systemRuleRepository;
        this.actionRepository = actionRepository;
    }
    addRule = async (data: SystemRuleAddQuery) => {
        const { compareType, userId, value, deviceAttrId } = data;
        let { actions } = data;
        if (!userId || !deviceAttrId || !value || !compareType || !actions) {
            throw createHttpError(400, "Missing required fields");
        }
        const attr = await this.deviceRepository.getDeviceAttrById({ attrId: deviceAttrId });
        // check if the deviceAttr exists
        if (!attr) {
            throw createHttpError(404, `attr ${deviceAttrId} not found`);
        }
        for (let i = 0; i < actions.length; i++) {
            if (!actions[i].deviceAttrId && !actions[i].value) {
                throw createHttpError(400, "actions data is invalid");
            }
            const attr = await this.deviceRepository.getDeviceAttrById({ attrId: deviceAttrId });
            // check if all deviceAttrId exists

            if (!attr) {
                throw createHttpError(404, `attr ${actions[i].deviceAttrId} not found`);
            }
        }
        await runTransaction(async (transaction: any) => {
            // create rule (transaction)
            const newRuleId = generateUUID();
            await this.systemRuleRepository.createRule(
                { id: newRuleId, compareType, value, deviceAttrId, userId },
                transaction
            );
            // create related actions (transaction)
            const addingActions: ActionAddData[] = actions.map((action) => ({ ...action, ruleId: newRuleId }));
            await this.actionRepository.createActions(addingActions, transaction);
        });
    };

    findRuleOfAttr = async (data: any) => {
        const { deviceAttrId } = data;
        return await this.systemRuleRepository.getRuleByAttrId({ deviceAttrId: deviceAttrId });
    };

    addActionToRule = async (data: any) => {
        //TODO: auth
        const { ruleId, value, deviceAttrId } = data;
        if (!ruleId || !value || !deviceAttrId) {
            throw createHttpError(400, "Missing fields");
        }
        return await this.actionRepository.createActions([{ ruleId, value, deviceAttrId }]);
    };

    getAllRules = async (data: SystemRuleViewQuery) => {
        const { userId } = data;
        if (!userId) {
            throw createHttpError(401, "Unauthorized");
        }
        const result = await this.systemRuleRepository.getRules({ userId });
        return result;
    };
}

export default SystemRuleService;
