class Device {
    feed: string;
    status: boolean;
    // value: number;
    constructor(feed: string, status: boolean) {
        this.feed = feed;
        this.status = status;
    }

    async updateDeviceStatus() {
        
    }
}

export default Device;
