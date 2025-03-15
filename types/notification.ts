export interface NotificationQuery {
    limit?: number;
    page?: number;
    sorting?: string[];
    unread?: boolean;
    userId: string;
}

export interface NotificationCreateQuery {
    message: string;
    userId: string;
    type: string;
    title: string;
}
