import mqtt from "mqtt";

import { AIO_CONFIG } from "../config/config";
import DeviceService from "../service/device.service";
import DeviceManager from "../temp_design_pattern/DeviceManager";
const deviceManager = DeviceManager.getInstance()

// Connect to Adafruit IO MQTT broker
console.log(AIO_CONFIG)
const client = mqtt.connect(AIO_CONFIG.MQTT_URL);

const subscribeToFeeds = async () => {
    try {
        const deviceService = new DeviceService();
        const feeds = await deviceService.getAllDeviceFeeds();
        if(feeds.length > 0)
            feeds.forEach((feed: string) => client.subscribe(feed));
        else
        {
            console.log("No feeds found")
        }
    } catch (error) {
        console.error("Error fetching feeds from database:", error);
    }
};

client.on("connect", async () => {
    console.log("Connected successfully...");
    await subscribeToFeeds(); // only run when server starts up
});

client.on("message", async (topic, message) => {
    console.log(`Message ${topic} ${message.toString()}`);
    //TODO: routing logic here
    await deviceManager.updateDeviceStatus(topic, message.toString())
});

client.on("error", (err) => {
    console.error("Connection error: ", err);
    client.end();
});

client.on("close", () => {
    console.log("Disconnected...");
});

export default client;
