import { FindOptions, UpdateOptions } from "sequelize";
import SystemRule from "../model/SystemRule.model";
import {
    SystemRuleAddData,
    SystemRuleDeleteQuery,
    SystemRuleInfoUpdateQuery,
    SystemRuleUpdateQuery,
} from "../types/system-rule";
import { generateUUID } from "../utils/idGenerator";
import Action from "../model/Action.model";
import DeviceAttribute from "../model/DeviceAttribute.model";
import Device from "../model/Device.model";

class SystemRuleRepository {
    async getRuleById(data: any, transaction = null) {
        const { ruleId } = data;
        const queryOption: FindOptions = {};
        if (transaction) {
            queryOption.transaction = transaction;
        }
        queryOption.where = { id: ruleId };
        return await SystemRule.findOne(queryOption);
    }

    async getRuleByAttrId(data: any, transaction = null) {
        const { deviceAttrId, value } = data;
        const queryOption: FindOptions = { where: {} };
        if (transaction) {
            queryOption.transaction = transaction;
        }
        if (deviceAttrId) {
            queryOption.where = { ...queryOption.where, deviceAttrId: deviceAttrId };
        }
        if (value !== undefined) {
            queryOption.where = { ...queryOption.where, value: value };
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
        const rules = await SystemRule.findAll(queryOption);
        console.log(rules);
        return rules;
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
        await SystemRule.create(newRule, queryOption);
    }

    async deleteRule(data: SystemRuleDeleteQuery, transaction = null) {
        const { ruleId } = data;
        const queryOption: FindOptions = {};
        if (transaction) {
            queryOption.transaction = transaction;
        }
        queryOption.where = { id: ruleId };
        return await SystemRule.destroy(queryOption);
    }

    async updateRuleInfo(data: SystemRuleInfoUpdateQuery, transaction = null) {
        const { ruleId, isActive, compareType, value, deviceAttrId } = data;
        const updateValues = Object.fromEntries(
            Object.entries({ isActive, compareType, value, deviceAttrId }).filter(([_, value]) => value !== undefined)
        );
        const queryOption: UpdateOptions = { where: { id: ruleId } };
        if (transaction) {
            queryOption.transaction = transaction;
        }
        return await SystemRule.update(updateValues, queryOption);
    }
}

export default SystemRuleRepository;
