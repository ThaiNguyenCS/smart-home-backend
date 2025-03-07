import mqtt from "mqtt";

import { AIO_CONFIG } from "../config/config";
import DeviceService from "../service/device.service";

// Connect to Adafruit IO MQTT broker
console.log(AIO_CONFIG)
const client = mqtt.connect(AIO_CONFIG.MQTT_URL);

const subscribeToFeeds = async () => {
    try {
        const deviceService = new DeviceService();
        const feeds = await deviceService.getAllDeviceFeeds();
        feeds.forEach((feed: string) => client.subscribe(feed));
    } catch (error) {
        console.error("Error fetching feeds from database:", error);
    }
};

client.on("connect", async () => {
    console.log("Connected successfully...");
    await subscribeToFeeds();
});

client.on("message", (topic, message) => {
    console.log(`Message ${topic} ${message.toString()}`);
    //TODO: routing logic here
});

client.on("error", (err) => {
    console.error("Connection error: ", err);
    client.end();
});

client.on("close", () => {
    console.log("Disconnected...");
});

export default client;
// Publish random values every 30 seconds
setInterval(() => {}, 1000);
