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
import DeviceLogController from "../controller/deviceLog.controller";
import DeviceLogRepository from "../repository/DeviceLogRepository";
import DeviceLogService from "../service/deviceLog.service";
import RealEstateRepository from "../repository/RealEstateRepository";
import RealEstateService from "../service/real-estate.service";
import RealEstateController from "../controller/real-estate.controller";
import FloorRepository from "../repository/FloorRepository";
import FloorService from "../service/floor.service";
import FloorController from "../controller/floor.controller";
import RoomRepository from "../repository/RoomRepository";
import RoomService from "../service/room.service";
import RoomController from "../controller/room.controller";
import ScheduleController from "../controller/schedule.controller";

const deviceRepository = new DeviceRepository();

const mqttService = MQTTService.getInstance();
// Schedule
const scheduleRepository = new ScheduleRepository();
const scheduleService = new ScheduleService({ scheduleRepository, deviceRepository });
const scheduleController = new ScheduleController({ scheduleService });
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

//Log
const deviceLogRepository = new DeviceLogRepository();
const deviceLogService = new DeviceLogService(deviceLogRepository);
const deviceLogController = new DeviceLogController(deviceLogService);

//Estate
const realEstateRepository = new RealEstateRepository();
const realEstateService = new RealEstateService(realEstateRepository);
const realEstateController = new RealEstateController(realEstateService);

//Floor
const floorRepository = new FloorRepository();
const floorService = new FloorService(floorRepository);
const floorController = new FloorController(floorService);

//Room
const roomRepository = new RoomRepository();
const roomService = new RoomService(roomRepository);
const roomController = new RoomController(roomService);

export {
    mqttService,
    deviceService,
    deviceController,
    deviceManager,
    systemRuleController,
    systemRuleService,
    scheduleService,
    notificationController,
    deviceLogController,
    realEstateController,
    deviceLogService,
    floorController,
    scheduleController,
    roomController,
};
