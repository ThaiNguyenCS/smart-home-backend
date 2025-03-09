import mqtt, { MqttClient } from "mqtt";

import { AIO_CONFIG } from "../config/config";
import DeviceService from "../service/device.service";
import DeviceManager from "../temp_design_pattern/DeviceManager";
const deviceManager = DeviceManager.getInstance();

// Connect to Adafruit IO MQTT broker
console.log(AIO_CONFIG);

class MQTTService {
    static instance: MQTTService;
    private client: MqttClient;
    private subscribedFeeds: string[];
    private constructor() {
        this.subscribedFeeds = [];
        this.client = mqtt.connect(AIO_CONFIG.MQTT_URL);
        this.client.on("connect", () => {
            console.log("MQTT client connected successfully...");
        });

        this.client.on("message", async (topic, message) => {
            console.log(`Message ${topic} ${message.toString()}`);
            //TODO: routing logic here
            await deviceManager.updateDeviceStatus(topic, message.toString());
        });

        this.client.on("error", (err) => {
            console.error("Connection error: ", err);
            this.client.end();
        });

        this.client.on("close", () => {
            console.log("Disconnected...");
        });
    }

    public static getInstance(): MQTTService {
        if (!this.instance) {
            this.instance = new MQTTService();
        }
        return this.instance;
    }

    public async subscribeToFeeds() {
        try {
            const deviceService = new DeviceService();
            const feeds = await deviceService.getAllDeviceFeeds(); // get all existing feeds from database
            if (feeds.length > 0) {
                for (const feed of feeds) {
                    if (!this.subscribedFeeds.includes(feed)) {
                        this.client.subscribe(feed);
                        this.subscribedFeeds.push(feed);
                        console.log(`Subscribed to new feed: ${feed}`);
                    } else {
                        console.log(`Already subscribed to feed: ${feed}`);
                    }
                }
            } else {
                console.log("No feeds found");
            }
        } catch (error) {
            console.error("Error fetching feeds from database:", error);
        }
    }
}

export default MQTTService;
