import SystemRule from "../model/SystemRule.model";
import { SystemRuleAddData } from "../types/system-rule";
import { generateUUID } from "../utils/idGenerator";

class SystemRuleRepository {
    async createRule(data: SystemRuleAddData, transaction = null) {
        let { compareType, deviceAttrId, value } = data;
        //TODO: check if data value is valid
        const newRule = {
            id: generateUUID(),
            compareType: compareType,
            deviceAttrId: deviceAttrId,
            value: value,
        };

        const queryOption: any = {};
        if (transaction) {
            queryOption.transaction = transaction;
        }
        await SystemRule.create(newRule, queryOption);
    }

    async deleteRule(data: any, transaction = null) {}
}

export default SystemRuleRepository;
