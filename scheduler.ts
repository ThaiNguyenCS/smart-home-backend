import cron from "node-cron";
import { deviceLogService, deviceManager, mqttService, scheduleService } from "./config/container";
import { getInfoFromSchedule } from "./utils/schedule";
import logger from "./logger/logger";
const SCHEDULE_TIME_PATTERN = "*/10 * * * * *"; // running every 10 secs

const scheduler = cron.schedule(SCHEDULE_TIME_PATTERN, async () => {
    // logger.info("Checking schedules..."); // find all due schedules
    const schedules = await scheduleService.findAllDueSchedules();
    // publish action to adafruit
    logger.info(`${schedules.length} schedules are due`);
    if (schedules.length > 0) {
        // Publish the schedule to MQTT or perform the activation action
        const promises = [];
        for (const sche of schedules) {
            const { feed, value } = getInfoFromSchedule(sche);
            promises.push(mqttService.publishMessage(feed, value));
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
