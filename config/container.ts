// FOR DEPENDENCY INJECTION

import MQTTService from "../service/mqtt.service";
import DeviceService from "../service/device.service";
import DeviceController from "../controller/device.controller";
import DeviceManager from "../temp_design_pattern/DeviceManager";

const mqttService = MQTTService.getInstance();
const deviceService = new DeviceService(mqttService);
mqttService.setDeviceService(deviceService)
const deviceController = new DeviceController(deviceService);
const deviceManager = DeviceManager.getInstance(); // get singleton instance of device manager
deviceManager.setDeviceService(deviceService);

export { mqttService, deviceService, deviceController, deviceManager };
