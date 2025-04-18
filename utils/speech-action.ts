import Device from "../model/Device.model";
import DeviceAttribute from "../model/DeviceAttribute.model";
import { mqttService } from "../config/container";

const PERMITTED_DEVICES: string[] = ["light", "fan"];
const PERMITTED_ACTIONS: Record<string, number> = { on: 1.0, off: 0 };

async function convertVoiceCommandToAction(data: { device: string; action: string }) {
    //TODO: check userId
    const { device, action } = data;
    if (!device || !action || PERMITTED_ACTIONS[action] === undefined || !PERMITTED_DEVICES.includes(device)) {
        throw new Error("Invalid device or action");
    }
    const devices = await Device.findAll({
        where: { type: device },
        include: [{ model: DeviceAttribute, as: "attributes", required: false }],
    });
    const promises: any = [];
    for (const device of devices) {
        device.attributes?.forEach((attr) => {
            promises.push(mqttService.publishMessage(attr.feed, PERMITTED_ACTIONS[action]));
        });
    }
    if (promises.length > 0) {
        await Promise.all(promises);
    }
}

export { convertVoiceCommandToAction };
