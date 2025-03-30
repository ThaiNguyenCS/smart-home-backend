export interface AddDeviceQuery {
    userId: string;
    name: string;
    roomId?: string;
    attrs?: AddDeviceAttrData[];
    type: string;
}

export type AddDeviceData = AddDeviceQuery & {
    id: string;
};

export interface RemoveDeviceQuery {
    userId: string;
    deviceId: string;
}

export type RemoveDeviceData = Omit<RemoveDeviceQuery, "userId">;

export interface RemoveDeviceAttrQuery {
    attrId: string;
    deviceId: string;
}

export type RemoveDeviceAttrData = Omit<RemoveDeviceAttrQuery, "userId">;

export interface AddDeviceAttrQuery {
    userId: string;
    deviceId: string;
    feed: string;
    key: string;
    isPublisher: boolean;
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
    isPublisher?: boolean;
    value?: number;
}

export type UpdateDeviceAttrData = Omit<UpdateDeviceAttrQuery, "userId" | "deviceId">;

export type UpdateDeviceData = Omit<UpdateDeviceQuery, "userId">;
