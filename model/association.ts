import Device from "./Device.model";
import DeviceAttribute from "./DeviceAttribute.model";

Device.hasMany(DeviceAttribute, {
    foreignKey: "deviceId",
    as: "attributes",
});
