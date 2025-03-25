import SystemRule from "../model/SystemRule.model";

const isRuleSatisfied = (rule: SystemRule, cmpValue: number): boolean => {
    const fRulevalue = rule.value;

    if (!rule.isActive) return false;
    switch (rule.compareType) {
        case "gte": {
            if (cmpValue >= fRulevalue) return true;
            break;
        }
        case "gt": {
            if (cmpValue > fRulevalue) return true;
            break;
        }
        case "eq": {
            if (cmpValue == fRulevalue) return true;
            break;
        }
        case "lt": {
            if (cmpValue < fRulevalue) return true;
            break;
        }
        case "lte": {
            if (cmpValue <= fRulevalue) return true;
            break;
        }
    }
    return false;
};

export { isRuleSatisfied };
