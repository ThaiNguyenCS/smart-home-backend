export interface RemoveDeviceAttrQuery {
    attrId: string;
}

export interface AddDeviceAttrQuery {
    deviceId: string;
    feed: string;
    key: string;
    valueType: "value"| "status";
    [otherProp: string]: any;
}