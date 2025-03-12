export interface SystemRuleAddQuery {
    userId: string;
    deviceAttrId: string;
    value: number;
    id: string;
    compareType: "eq" | "lte" | "gte" | "lt" | "gt";
    actions: ActionType[];
}

export type SystemRuleAddData = Omit<SystemRuleAddQuery, "actions">;

export interface ActionType {
    value: number;
    deviceAttrId: string;
}

export interface ActionAddData {
    value: number;
    deviceAttrId: string;
    ruleId: string;
}

export interface SystemRuleViewQuery {
    userId: string;
}
