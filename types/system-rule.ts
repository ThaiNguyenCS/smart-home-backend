export interface SystemRuleAddQuery {
    userId: string;
    deviceAttrId: string;
    value: string;
    compareType: "eq" | "lte" | "gte" | "lt" | "gt";
    actions: ActionType[];
}

export type SystemRuleAddData = Omit<SystemRuleAddQuery, "userId" | "actions">;

export interface ActionType {
    value: string;
    deviceAttrId: string;
}
