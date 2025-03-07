const cron = require("node-cron");
const scheduler = cron.schedule("* * * * * *", async () => {
    console.log("Checking schedules...");
    const now = new Date();
});

export default scheduler;
