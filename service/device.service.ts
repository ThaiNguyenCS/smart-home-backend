import DeviceRepository from "../repository/DeviceRepository";

class DeviceService {
    deviceRepository: DeviceRepository;
    constructor() {
        this.deviceRepository = new DeviceRepository();
    }

    async getAllDeviceFeeds() {
        let devices = await this.deviceRepository.getDeviceByCondition({});
        let result: any = [];
        devices.forEach((dev) => result.push(dev.feed));
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
}

export default DeviceService;
