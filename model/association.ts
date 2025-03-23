import Action from "./Action.model";
import Device from "./Device.model";
import DeviceAttribute from "./DeviceAttribute.model";
import Schedule from "./Schedule.model";
import SystemRule from "./SystemRule.model";
import User from "./User.model";
import RealEstate from "./RealEstate.model";
import Floor from "./Floor.model";
import Room from "./Room.model";

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


User.hasMany(RealEstate, {
    foreignKey: "userId",
    as: "estates",
    onDelete: "CASCADE",
});
RealEstate.belongsTo(User, {
    foreignKey: "userId",
    as: "owner",
});


RealEstate.hasMany(Floor, {
    foreignKey: "realEstateId",
    as: "floors",
    onDelete: "CASCADE",
    hooks: true,
});
Floor.belongsTo(RealEstate, {
    foreignKey: "realEstateId",
    as: "realEstate",
    onDelete: "CASCADE",
});


Floor.hasMany(Room, {
    foreignKey: "floorId",
    as: "rooms",
    onDelete: "CASCADE",
    hooks: true,
});
Room.belongsTo(Floor, {
    foreignKey: "floorId",
    as: "floor",
    onDelete: "CASCADE",
});
