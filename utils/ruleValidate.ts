import SystemRule from "../model/SystemRule.model";

const isRuleSatisfied = (rule: SystemRule, cmpValue: string): boolean => {
    const fCmpValue = parseFloat(cmpValue);
    const fRulevalue = rule.value;
    // console.log(fCmpValue + " vs " + fRulevalue);

    if (!rule.isActive) return false;
    switch (rule.compareType) {
        case "gte": {
            if (fCmpValue >= fRulevalue) return true;
            break;
        }
        case "gt": {
            if (fCmpValue > fRulevalue) return true;
            break;
        }
        case "eq": {
            if (fCmpValue == fRulevalue) return true;
            break;
        }
        case "lt": {
            if (fCmpValue < fRulevalue) return true;
            break;
        }
        case "lte": {
            if (fCmpValue <= fRulevalue) return true;
            break;
        }
    }
    return false;
};

export { isRuleSatisfied };
