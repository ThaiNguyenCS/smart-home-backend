// FOR DEPENDENCY INJECTION

import MQTTService from "../service/mqtt.service";
import DeviceService from "../service/device.service";
import DeviceController from "../controller/device.controller";
import DeviceManager from "../temp_design_pattern/DeviceManager";
import SystemRuleController from "../controller/system-rule.controller";
import SystemRuleService from "../service/system-rule.service";
import DeviceRepository from "../repository/DeviceRepository";
import SystemRuleRepository from "../repository/SystemRuleRepository";
import ActionRepository from "../repository/ActionRepository";

const mqttService = MQTTService.getInstance();
const deviceService = new DeviceService(mqttService);
mqttService.setDeviceService(deviceService);
const deviceController = new DeviceController(deviceService);
const deviceManager = DeviceManager.getInstance(); // get singleton instance of device manager
deviceManager.setDeviceService(deviceService);

const deviceRepository = new DeviceRepository();
const systemRuleRepository = new SystemRuleRepository();
const actionRepository = new ActionRepository();
const systemRuleService = new SystemRuleService({ deviceRepository, systemRuleRepository, actionRepository });
const systemRuleController = new SystemRuleController(systemRuleService);
export { mqttService, deviceService, deviceController, deviceManager, systemRuleController };
