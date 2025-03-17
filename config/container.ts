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
import NotificationController from "../controller/notification.controller";
import NotificationRepository from "../repository/NotificationRepository";
import NotificationService from "../service/notification.service";
import ScheduleService from "../service/schedule.service";
import ScheduleRepository from "../repository/ScheduleRepository";

const deviceRepository = new DeviceRepository();

const mqttService = MQTTService.getInstance();
// schedule repository
const scheduleRepository = new ScheduleRepository();
// schedule service
const scheduleService = new ScheduleService({ scheduleRepository, deviceRepository });
const deviceService = new DeviceService(mqttService);
mqttService.setDeviceService(deviceService);
const deviceController = new DeviceController({ deviceService, scheduleService });
const deviceManager = DeviceManager.getInstance(); // get singleton instance of device manager
deviceManager.setDeviceService(deviceService);

const systemRuleRepository = new SystemRuleRepository();
const actionRepository = new ActionRepository();
const systemRuleService = new SystemRuleService({ deviceRepository, systemRuleRepository, actionRepository });
const systemRuleController = new SystemRuleController(systemRuleService);

// Notification
const notificationRepository = new NotificationRepository();
const notificationService = new NotificationService(notificationRepository);
const notificationController = new NotificationController(notificationService);

export {
    mqttService,
    deviceService,
    deviceController,
    deviceManager,
    systemRuleController,
    systemRuleService,
    notificationController,
};
