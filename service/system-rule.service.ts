import createHttpError from "http-errors";
import { SystemRuleAddQuery } from "../types/system-rule";
import DeviceRepository from "../repository/DeviceRepository";
import SystemRuleRepository from "../repository/SystemRuleRepository";
import ActionRepository from "../repository/ActionRepository";
import { runTransaction } from "../model/transactionManager";
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
            await this.systemRuleRepository.createRule({ compareType, value, deviceAttrId }, transaction);
            // create related actions (transaction)
            await this.actionRepository.createActions(actions, transaction);
        });
    };
}

export default SystemRuleService;
