import logger from "../logger/logger";
import Action from "../model/Action.model";
import { NOTIFICATION_TYPES, NotificationCreationAttrs } from "../model/Notification.model";
import SystemRule from "../model/SystemRule.model";
import { generateUUID } from "./idGenerator";

const COMPARATOR_MAPPING: Record<string, string> = {
    gt: "is higher than",
    lt: "is below",
    gte: "is higher than",
    lte: "is below",
    eq: "reachs",
};

const ACTION_VALUE_MAPPING: Record<number, string> = {
    1.0: "Turned on",
    0.0: "Turned off",
};

const generateNotificationData = (rule: SystemRule, actions: Action[]) => {
    let message = `${rule.deviceAttribute?.device?.name} ${COMPARATOR_MAPPING[rule.compareType]} ${
        rule.value
    }, activates:\n${actions
        .map((action) => `${ACTION_VALUE_MAPPING[action.value]} ${action.deviceAttribute?.device?.name}`)
        .join("\n")}
    `;
    logger.info(`Notification: ${message}`);
    return {
        userId: rule.userId,
        title: "Rule is activated",
        message: message,
        type: NOTIFICATION_TYPES.NOTIFY,
    };
};

export { generateNotificationData };
