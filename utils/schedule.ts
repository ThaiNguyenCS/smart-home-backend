import Schedule from "../model/Schedule.model";

// export function getInfoFromSchedule(schedule: Schedule) {
//     return { feed: schedule.deviceAttribute!.feed, value: schedule.value };
// }

export function getInfoFromScheduleV2(schedule: Schedule) {
    const actions: any = [];
    if (!schedule.DeviceAttributes) return actions;
    for (const attr of schedule.DeviceAttributes) {
        actions.push({ feed: attr.feed, value: schedule.value });
    }
    return actions;
}
