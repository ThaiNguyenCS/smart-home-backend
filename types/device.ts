export interface AddDeviceQuery {
    userId: string;
    name: string;
    roomId?: string;
}

export type AddDeviceData = Omit<AddDeviceQuery, "userId">;

export interface RemoveDeviceQuery {
    userId: string;
    deviceId: string;
}

export type RemoveDeviceData = Omit<RemoveDeviceQuery, "userId">;

export interface RemoveDeviceAttrQuery {
    userId: string;
    attrId: string;
    deviceId: string;
}

export type RemoveDeviceAttrData = Omit<RemoveDeviceAttrQuery, "userId">;

export interface AddDeviceAttrQuery {
    userId: string;
    deviceId: string;
    feed: string;
    key: string;
    valueType: "value" | "status";
    [otherProp: string]: any;
}

export type AddDeviceAttrData = Omit<AddDeviceAttrQuery, "userId">;

export interface UpdateDeviceQuery {
    userId: string;
    deviceId: string;
    name?: string;
    roomId?: string;
    [otherProp: string]: any;
}

export type UpdateDeviceData = Omit<UpdateDeviceQuery, "userId">;
