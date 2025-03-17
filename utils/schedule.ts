import Schedule from "../model/Schedule.model";

export function getInfoFromSchedule(schedule: Schedule) {
    return { feed: schedule.deviceAttribute!.feed, value: schedule.value };
}
