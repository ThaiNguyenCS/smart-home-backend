import Device from "./Device";

class DeviceManager {
    static instance: DeviceManager;
    devices: Device[] = [];
    static getInstance() {
        if (!DeviceManager.instance) {
            DeviceManager.instance = new DeviceManager();
        }
        return DeviceManager.instance;
    }

    async loadDevicesFromDB() {
        //TODO: load devices to this.devices
    }
}

export default DeviceManager;
