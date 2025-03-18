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

    async loadDevicesFromDB() {
        //TODO: load only necessary devices
        let devices = await this.deviceService.getAllDevice({
            options: { attribute: { required: true } },
        });
        this.devices = devices;
    }

    addNewDevice() {
        console.log("start addNewDevice");
        console.log("end addNewDevice");
    }

    removeDevice() {
        console.log("start removeDevice");
       
        console.log("end removeDevice");
    }

    async updateDeviceStatus(feed: string, value: string) {
        const device = this.devices.find((dev) => dev.containsFeed(feed) !== undefined);
        if (!device) {
            throw new Error(`Cannot find device with feed ${feed}`);
        }
        await device.updateDeviceStatus({ feed, value });
    }
}

export default DeviceManager;
