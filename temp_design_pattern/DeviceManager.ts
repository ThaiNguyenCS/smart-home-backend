// import Device from "./Device";
import Device from "../model/Device.model";
import DeviceService from "../service/device.service";
class DeviceManager {
    static instance: DeviceManager;
    private deviceService = new DeviceService();
    devices: Device[] = [];
    public static getInstance() {
        if (!DeviceManager.instance) {
            DeviceManager.instance = new DeviceManager();
        }
        return DeviceManager.instance;
    }

    async loadDevicesFromDB() {
        //TODO: load only necessary devices
        const devices = await this.deviceService.getAllDevice({
            options: { includes: { attribute: { required: true } } },
        });
        this.devices = devices;
    }

    async updateDeviceStatus(feed: string, value: string) {
        const device = this.devices.find((dev) => dev.containsFeed(feed));
        if (!device) {
            throw new Error(`Cannot find device with feed ${feed}`);
        }

        await device.updateDeviceStatus({ feed, value });
    }
}

export default DeviceManager;
