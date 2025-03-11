import Action from "../model/Action.model";
import { ActionType } from "../types/system-rule";
import { generateUUID } from "../utils/idGenerator";

class ActionRepository {
    createActions = async (actions: ActionType[], transaction = null) => {
        let createdActions = [];
        const queryOption: any = {};
        if (transaction) {
            queryOption.transaction = transaction;
        }
        for (let i = 0; i < actions.length; i++) {
            createdActions.push({
                id: generateUUID(),
                deviceAttrId: actions[i].deviceAttrId,
                value: actions[i].value,
            });
        }
        await Action.bulkCreate(createdActions, queryOption);
    };
}

export default ActionRepository;
