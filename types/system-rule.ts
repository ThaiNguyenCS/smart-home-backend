export interface SystemRuleAddQuery {
    userId: string;
    deviceAttrId: string;
    value: number;
    id: string;
    compareType: "eq" | "lte" | "gte" | "lt" | "gt";
    receiveNotification?: boolean;
    actions: ActionType[];
}

export interface SystemRuleUpdateQuery {
    userId: string;
    ruleId: string;
    receiveNotification?: boolean;
    deviceAttrId?: string;
    isActive?: boolean;
    value?: number;
    compareType?: "eq" | "lte" | "gte" | "lt" | "gt";
    actions?: ActionType[];
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

export interface SystemRuleDeleteQuery {
    userId: string;
    ruleId: string;
}

export interface SystemRuleInfoUpdateQuery {
    userId: string;
    ruleId: string;
    isActive?: boolean;
    compareType?: "gte" | "gt" | "lt" | "lte" | "eq";
    value?: number;
    deviceAttrId?: string;
    receiveNotification?: boolean;
}
