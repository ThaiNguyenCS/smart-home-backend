import { DestroyOptions } from "sequelize";
import Action from "../model/Action.model";
import { ActionAddData, ActionType } from "../types/system-rule";
import { generateUUID } from "../utils/idGenerator";

class ActionRepository {
    createActions = async (actions: ActionAddData[], transaction = null) => {
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
                ruleId: actions[i].ruleId,
            });
        }
        return await Action.bulkCreate(createdActions, queryOption);
    };

    updateActionsOfRule = async (ruleId: string, actions: ActionAddData[], transaction = null) => {
        const queryOption: DestroyOptions = {};
        queryOption.where = { ruleId: ruleId };
        if (transaction) {
            queryOption.transaction = transaction;
        }
        await Action.destroy(queryOption); // delete all the old ones
        return this.createActions(actions, transaction); // create the new ones
    };
}

export default ActionRepository;
