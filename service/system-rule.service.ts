import createHttpError from "http-errors";
import {
    ActionAddData,
    SystemRuleAddQuery,
    SystemRuleDeleteQuery,
    SystemRuleUpdateQuery,
    SystemRuleViewQuery,
} from "../types/system-rule";
import DeviceRepository from "../repository/DeviceRepository";
import SystemRuleRepository from "../repository/SystemRuleRepository";
import ActionRepository from "../repository/ActionRepository";
import { runTransaction } from "../model/transactionManager";
import { generateUUID } from "../utils/idGenerator";
import DeviceAttribute from "../model/DeviceAttribute.model";
import Device from "../model/Device.model";
import Room from "../model/Room.model";
class SystemRuleService {
    private deviceRepository: DeviceRepository;
    private systemRuleRepository: SystemRuleRepository;
    private actionRepository: ActionRepository;
    constructor({ deviceRepository, systemRuleRepository, actionRepository }: any) {
        this.deviceRepository = deviceRepository;
        this.systemRuleRepository = systemRuleRepository;
        this.actionRepository = actionRepository;
    }

    _checkIfRuleBelongsToUser = async (userId: string, ruleId: string): Promise<Boolean> => {
        const rule = await this.systemRuleRepository.getRuleById({ ruleId });
        if (!rule) throw createHttpError(404, `Rule ${ruleId} not found`);
        if (rule.userId !== userId) {
            return false;
        }
        return true;
    };

    updateRule = async (data: SystemRuleUpdateQuery) => {
        const { userId, ruleId, actions, isActive, compareType, value, deviceAttrId } = data;

        if (!userId || !ruleId) {
            throw createHttpError(400, "Missing required fields");
        }
        const authResult = await this._checkIfRuleBelongsToUser(userId, ruleId);
        if (!authResult) throw createHttpError(401, "Unauthorized");
        if (actions) {
            for (let i = 0; i < actions.length; i++) {
                if (!actions[i].deviceAttrId && !actions[i].value) {
                    throw createHttpError(400, "actions data is invalid");
                }
                const attr = await this.deviceRepository.getDeviceAttrById({ attrId: actions[i].deviceAttrId });
                // check if all deviceAttrId exists

                if (!attr) {
                    throw createHttpError(404, `attr ${actions[i].deviceAttrId} not found`);
                }
            }
        }

        await runTransaction(async (transaction: any) => {
            await this.systemRuleRepository.updateRuleInfo(
                { userId, ruleId, isActive, compareType, value, deviceAttrId },
                transaction
            );
            if (actions) {
                const addingActions: ActionAddData[] = actions.map((action) => ({ ...action, ruleId: ruleId }));
                await this.actionRepository.updateActionsOfRule(ruleId, addingActions, transaction);
            }
        });
    };

    // updateRuleStatus = async (data: SystemRuleUpdateQuery) => {
    //     const { userId, ruleId, isActive } = data;
    //     if (!userId || !ruleId || isActive === undefined) {
    //         throw createHttpError(400, "Missing required fields");
    //     }
    //     const authResult = await this._checkIfRuleBelongsToUser(userId, ruleId);
    //     if (!authResult) throw createHttpError(401, "Unauthorized");
    //     await this.systemRuleRepository.updateRule(data);
    // };

    updateRuleInfo = async (data: SystemRuleUpdateQuery) => {
        const { userId, ruleId } = data;
        console.log(data);
        if (!userId || !ruleId) {
            throw createHttpError(400, "Missing required fields");
        }
        const authResult = await this._checkIfRuleBelongsToUser(userId, ruleId);
        if (!authResult) throw createHttpError(401, "Unauthorized");
        await this.systemRuleRepository.updateRuleInfo(data);
    };

    addRule = async (data: SystemRuleAddQuery) => {
        const { compareType, userId, value, deviceAttrId, receiveNotification } = data;
        let { actions } = data;

        console.log(data);
        if (!userId || !deviceAttrId || value === undefined || !compareType || !actions) {
            throw createHttpError(400, "Missing required fields");
        }
        const attr = await this.deviceRepository.getDeviceAttrById({ attrId: deviceAttrId });
        // check if the deviceAttr exists
        if (!attr) {
            throw createHttpError(404, `attr ${deviceAttrId} not found`);
        }
        if (!attr.isPublisher) {
            // check if this attr can be set as a master of system rule
            throw createHttpError(403, `attr ${deviceAttrId} cannot be a master attribute`);
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
                { id: newRuleId, compareType, value, deviceAttrId, userId, receiveNotification },
                transaction
            );
            // create related actions (transaction)
            const addingActions: ActionAddData[] = actions.map((action) => ({ ...action, ruleId: newRuleId }));
            await this.actionRepository.createActions(addingActions, transaction);
        });
    };

    findRuleOfAttr = async (data: { deviceAttrId: string; value: number }) => {
        const { deviceAttrId, value } = data;
        return await this.systemRuleRepository.getRuleByAttrId({ deviceAttrId: deviceAttrId, value: value });
    };

    addActionToRule = async (data: any) => {
        //TODO: auth
        const { userId, ruleId, value, deviceAttrId } = data;
        if (!userId || !ruleId || !value || !deviceAttrId) {
            throw createHttpError(400, "Missing fields");
        }
        const authResult = await this._checkIfRuleBelongsToUser(userId, ruleId);
        if (!authResult) throw createHttpError(401, "Unauthorized");
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
    deleteRule = async (data: SystemRuleDeleteQuery) => {
        const { userId, ruleId } = data;
        if (!ruleId) {
            throw createHttpError(400, "Missing fields");
        }
        const authResult = await this._checkIfRuleBelongsToUser(userId, ruleId);
        if (!authResult) throw createHttpError(401, "Unauthorized");
        return await this.systemRuleRepository.deleteRule(data);
    };

    getAvailablePublishers = async (data: any) => {
        const { userId } = data;
        const existingRules = await this.systemRuleRepository.getRules({ userId });
        const devices = await this.deviceRepository.getDeviceByCondition({ userId, options: { attribute: {} } });
        let availablePublisherIds: string[] = []; // store all available publisher ids
        let usedPublisherIds: string[] = []; // store used publisher ids
        const promises = [];
        // for (let i = 0; i < existingRules.length; i++) {
        //     usedPublisherIds.push(existingRules[i].deviceAttrId);
        // }
        for (let i = 0; i < devices.length; i++) {
            devices[i].attributes?.forEach((attr) => {
                if (attr.isPublisher && !usedPublisherIds.find((id) => id === attr.id)) {
                    availablePublisherIds.push(attr.id);
                }
            }); // get all available publisher ids
        }
        for (const id of availablePublisherIds) {
            promises.push(this.deviceRepository.getDeviceAttrById({ attrId: id, options: { includeDevice: true } }));
        }
        return await Promise.all(promises);
    };

    getAvailableSubscribers = async (data: any) => {
        const { userId } = data;
        const result = await DeviceAttribute.findAll({
            where: { isPublisher: false },
            include: [
                {
                    model: Device,
                    as: "device",
                    foreignKey: "deviceId",
                    where: {
                        userId: userId,
                    },
                    include: [
                        {
                            model: Room,
                            as: "room",
                            required: false,
                            attributes: ["id", "name", "floorId"],
                        },
                    ],
                },
            ],
        });
        return result;
    };
}

export default SystemRuleService;
