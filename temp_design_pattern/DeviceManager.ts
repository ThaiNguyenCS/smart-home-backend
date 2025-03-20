// import Device from "./Device";
import Device from "../model/Device.model";
import DeviceService from "../service/device.service";
class DeviceManager {
    static instance: DeviceManager;
    private deviceService!: DeviceService;
    private devices: Device[] = [];
    public static getInstance() {
        if (!DeviceManager.instance) {
            DeviceManager.instance = new DeviceManager();
        }
        return DeviceManager.instance;
    }

    public setDeviceService(deviceService: DeviceService) {
        this.deviceService = deviceService;
    }

    async reloadDevice(deviceId: string) {
        // find the position of device in devices
        const index = this.devices.findIndex((dev) => dev.id === deviceId);
        if (index !== -1) {
            // query the new one from the database
            const device = await this.deviceService.getDeviceById({
                id: deviceId,
                options: { attribute: { required: false } },
            });
            this.devices[index] = device;
        } else {
            console.error(`At reloadDevice: Cannot find device with id ${deviceId}`);
        }

        // replace the old one
    }

    async loadDevicesFromDB() {
        //TODO: load only necessary devices
        let devices = await this.deviceService.getAllDevice({
            options: { attribute: { required: true } },
        });
        this.devices = devices;
    }

    addNewDevice(newDevice: Device) {
        this.devices.push(newDevice);
    }

    removeDevice(deviceId: string) {
        this.devices = this.devices.filter((dev) => dev.id !== deviceId);
    }

    async updateDeviceStatus(feed: string, value: string) {
        const device = this.devices.find((dev) => dev.containsFeed(feed) !== undefined);
        if (!device) {
            throw new Error(`Cannot find device with feed ${feed}`);
        }
        await device.updateDeviceStatus({ feed, value });
    }

    async logging() {
        console.log(`Device manager has ${this.devices.length} devices`);
    }
}

export default DeviceManager;
