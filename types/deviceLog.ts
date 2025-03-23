export interface GetDeviceLogsQuery {
    deviceAttrId?: string;
    value?: number;
    createdAt?: Date;
}

export interface AddDeviceLogQuery {
    deviceAttrId: string;
    value: number;
    createdAt?: Date;
}

export type AddDeviceLogData = AddDeviceLogQuery & {
    id: string;
};

export interface UpdateDeviceLogData {
    logId: string;
    value?: number;
    createdAt?: Date;
}
