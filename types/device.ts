export interface AddDeviceQuery {
    userId: string;
    name: string;
    roomId?: string;
    attrs?: AddDeviceAttrData[];
}

export type AddDeviceData = Omit<AddDeviceQuery, "userId"> & {
    id: string;
};

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
    isListener: boolean;
}

export type AddDeviceAttrData = Omit<AddDeviceAttrQuery, "userId">;

export interface UpdateDeviceQuery {
    userId: string;
    deviceId: string;
    name?: string;
    roomId?: string;
    [otherProp: string]: any;
}

export interface UpdateDeviceAttrQuery {
    userId: string;
    deviceId: string;
    attrId: string;
    key?: string;
    valueType?: "value" | "status";
}

export type UpdateDeviceAttrData = Omit<UpdateDeviceAttrQuery, "userId" | "deviceId">;

export type UpdateDeviceData = Omit<UpdateDeviceQuery, "userId">;
