export interface GetDeviceLogsQuery {
    deviceAttrId?: string;
    value?: string;
    createdAt?: Date;
}

export interface AddDeviceLogQuery {
    deviceAttrId: string;
    value: string;
    createdAt?: Date;
}

export type AddDeviceLogData = AddDeviceLogQuery & {
    id: string;
};

export interface UpdateDeviceLogData {
    logId: string;
    value?: string;
    createdAt?: Date;
}

