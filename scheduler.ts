import cron from "node-cron";
import { deviceLogService, deviceManager, mqttService, scheduleService } from "./config/container";
import { getInfoFromScheduleV2 } from "./utils/schedule";
import logger from "./logger/logger";
const SCHEDULE_TIME_PATTERN = "*/10 * * * * *"; // running every 10 secs

const scheduler = cron.schedule(SCHEDULE_TIME_PATTERN, async () => {
    // logger.info("Checking schedules..."); // find all due schedules
    const schedules = await scheduleService.findAllDueSchedulesV2();
    // publish action to adafruit
    logger.info(`${schedules.length} schedules are due`);
    if (schedules.length > 0) {
        // Publish the schedule to MQTT or perform the activation action
        const promises = [];
        for (const sche of schedules) {
            const actions = getInfoFromScheduleV2(sche);
            for (const action of actions) {
                promises.push(mqttService.publishMessage(action.feed, action.value));
            }
        }
        // perform action
        await Promise.all(promises);
        // Update lastActiveDate to prevent reactivation
        await scheduleService.updateLastActiveDate(schedules.map((s) => s.id));
    }
    deviceManager.logging();
});

const logCleanUpScheduler = cron.schedule("27 12 * * *", async () => {
    //TODO: Clean up logs
    try {
        await deviceLogService.cleanUpDeviceLogs();
        logger.info("Clean up logs successfully");
    } catch (error) {
        logger.error("Clean up logs failed", error);
    }
});

export default scheduler;
