import Device from "../model/Device.model";

export const toDeviceDTO = (device : Device) => {
    return {
        name: device.name,
        id: device.id,
        room: device.room,
        power: device.power
    }
}