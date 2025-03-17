import cron from "node-cron";
import { mqttService, scheduleService } from "./config/container";
import { getInfoFromSchedule } from "./utils/schedule";
const TIME_PATTERN = "*/10 * * * * *"; // running every 1 min

const scheduler = cron.schedule(TIME_PATTERN, async () => {
    console.log("Checking schedules...");
    // find all due schedules
    const schedules = await scheduleService.findAllDueSchedules();
    // publish action to adafruit
    console.log(`${schedules.length} schedules are due`);
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
});

export default scheduler;
