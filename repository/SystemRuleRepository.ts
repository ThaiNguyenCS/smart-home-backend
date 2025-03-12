import { FindOptions } from "sequelize";
import SystemRule from "../model/SystemRule.model";
import { SystemRuleAddData } from "../types/system-rule";
import { generateUUID } from "../utils/idGenerator";
import Action from "../model/Action.model";
import DeviceAttribute from "../model/DeviceAttribute.model";
import Device from "../model/Device.model";

class SystemRuleRepository {

    async getRuleByAttrId(data: any, transaction = null) {
        const { deviceAttrId } = data;
        const queryOption: FindOptions = {};
        if (transaction) {
            queryOption.transaction = transaction;
        }
        queryOption.include = [
            { model: DeviceAttribute, as: "deviceAttribute", required: true },
            {
                model: Action,
                as: "actions",
                required: false,
                include: [{ model: DeviceAttribute, as: "deviceAttribute", required: true }],
            },
        ];
        queryOption.where = { deviceAttrId: deviceAttrId };
        const rule = await SystemRule.findOne(queryOption); // find one here because I'm currently allowing one rule for one attr only
        return rule;
    }

    async getRules(data: any, transaction = null) {
        const { userId } = data;
        const queryOption: FindOptions = {};
        queryOption.where = { userId: userId };
        queryOption.include = [
            {
                model: DeviceAttribute,
                as: "deviceAttribute",
                required: true,
                include: [
                    {
                        model: Device,
                        as: "device",
                        required: true,
                    },
                ],
            },
            {
                model: Action,
                as: "actions",
                required: false,
                include: [
                    {
                        model: DeviceAttribute,
                        as: "deviceAttribute",
                        required: true,
                        include: [
                            {
                                model: Device,
                                as: "device",
                                required: true,
                            },
                        ],
                    },
                ],
            },
        ];
        return await SystemRule.findAll(queryOption);
    }

    async createRule(data: SystemRuleAddData, transaction = null) {
        let { id, compareType, deviceAttrId, value, userId } = data;
        //TODO: check if userId can access deviceAttrId
        const newRule = {
            id: id,
            compareType: compareType,
            deviceAttrId: deviceAttrId,
            value: value,
            userId: userId,
        };

        const queryOption: FindOptions = {};
        if (transaction) {
            queryOption.transaction = transaction;
        }
        // await SystemRule.create(newRule, queryOption);
    }

    async deleteRule(data: any, transaction = null) {}
}

export default SystemRuleRepository;
