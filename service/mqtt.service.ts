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
    private deviceService!: DeviceService;
    private constructor() {
        this.subscribedFeeds = [];
        this.client = mqtt.connect(AIO_CONFIG.MQTT_URL);
        this.client.on("connect", async () => {
            console.log("MQTT client connected successfully...");
            await this.subscribeToAllFeeds(); // subscribe to all existing feeds
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

    public setDeviceService(deviceService: DeviceService) {
        this.deviceService = deviceService;
    }

    // subscribe to a new feed
    public async subscribeToFeed(feed: string) {
        try {
            if (this.client.connected) {
                if (!this.subscribedFeeds.includes(feed)) {
                    this.client.subscribe(feed, (err) => {
                        if (!err) {
                            this.subscribedFeeds.push(feed); // add new subcribed feed to list
                            console.log(`Subscribed to new feed: ${feed}`);
                        } else {
                            console.error(`Error when subcribing to feed ${feed}`);
                        }
                    });
                } else {
                    console.log(`Already subscribed to feed: ${feed}`);
                }
            } else {
                console.error("Client hasn't connected yet");
            }
        } catch (error) {
            console.error(error);
        }
    }

    // unsubscribe to a feed
    public async unsubscribeFeed(feed: string) {
        try {
            if (this.client.connected) {
                if (this.subscribedFeeds.includes(feed)) {
                    this.client.unsubscribe(feed, (err) => {
                        if (!err) {
                            this.subscribedFeeds = this.subscribedFeeds.filter((f) => f !== feed); // remove unsubcribed feed from list
                            console.log(`Unsubscribe feed ${feed} successfully`);
                        } else {
                            console.error(`Error when unsubcribing feed ${feed}`);
                        }
                    });
                } else {
                    console.log(`Feed: ${feed} not found`);
                }
            } else {
                console.error("Client hasn't connected yet");
            }
        } catch (error) {
            console.error(error);
        }
    }

    // subscribe to all feeds fetch from database when start up
    public async subscribeToAllFeeds() {
        try {
            if (this.client.connected) {
                if (this.deviceService) {
                    const feeds = await this.deviceService.getAllDeviceFeeds(); // get all existing feeds from database
                    if (feeds.length > 0) {
                        for (const feed of feeds) {
                            if (!this.subscribedFeeds.includes(feed)) {
                                this.client.subscribe(feed, (err) => {
                                    if (!err) {
                                        this.subscribedFeeds.push(feed); // add new subcribed feed to list
                                    } else {
                                        console.error(`Error when subcribing to feed ${feed}`);
                                    }
                                });
                                console.log(`Subscribed to new feed: ${feed}`);
                            } else {
                                console.log(`Already subscribed to feed: ${feed}`);
                            }
                        }
                    } else {
                        console.log("No feeds found");
                    }
                } else {
                    console.error("MQTTClient does not have deviceService");
                }
            } else {
                console.error("Client hasn't connected yet");
            }
        } catch (error) {
            console.error("Error fetching feeds from database:", error);
        }
    }

    public async publishMessage(feed: string, value: number) {
        // console.log(typeof value);
        console.log(`MQTT Client publishes to topic ${feed} with value: ${value}`);
        await this.client.publishAsync(feed, value.toString());
    }
}

export default MQTTService;
