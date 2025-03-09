import DeviceRepository from "../repository/DeviceRepository";

class DeviceService {
    deviceRepository: DeviceRepository;
    constructor() {
        this.deviceRepository = new DeviceRepository();
    }

    async getAllDeviceFeeds() {
        //TODO: add condition
        let devices = await this.deviceRepository.getDeviceByCondition({ options: { attribute: { required: true } } });
        let result: any = [];
        devices.forEach((dev) => dev.attributes?.forEach((attr) => result.push(attr.feed)));
        console.log("device feeds:" + result);
        return result;
    }

    async getAllDevice(data: any) {
        const result = await this.deviceRepository.getDeviceByCondition(data);
        return result;
    }

    async addDevice(data: any) {
        const result = await this.deviceRepository.addDevice(data);
        return result;
    }

    async removeDevice(data: any) {
        const result = await this.deviceRepository.removeDevice(data);
        return result;
    }

    async updateDevice(data: any) {
        const { id, feed, name } = data;
    }

    async getDeviceById(data: any) {
        return await this.deviceRepository.getDeviceById(data);
    }

    async getDeviceByCondition(data: any) {
        const { name, feed } = data;
    }

    async createDeviceAttr(data: any) {
        const result = await this.deviceRepository.createDeviceAttr(data);
        return result;
    }

    async reloadDevices (data: any) {
        const {userId} = data
        

    }
}

export default DeviceService;
