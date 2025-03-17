import Action from "./Action.model";
import Device from "./Device.model";
import DeviceAttribute from "./DeviceAttribute.model";
import Schedule from "./Schedule.model";
import SystemRule from "./SystemRule.model";

Device.hasMany(DeviceAttribute, {
    foreignKey: "deviceId",
    as: "attributes",
});

DeviceAttribute.belongsTo(Device, {
    foreignKey: "deviceId",
    as: "device",
});

SystemRule.belongsTo(DeviceAttribute, {
    foreignKey: "deviceAttrId",
    as: "deviceAttribute",
});

SystemRule.hasMany(Action, {
    foreignKey: "ruleId",
    as: "actions",
});

Action.belongsTo(DeviceAttribute, {
    foreignKey: "deviceAttrId",
    as: "deviceAttribute",
});

Schedule.belongsTo(DeviceAttribute, {
    foreignKey: "deviceAttrId",
    as: "deviceAttribute",
})