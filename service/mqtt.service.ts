import mqtt, { MqttClient } from "mqtt";

import { AIO_CONFIG } from "../config/config";
import DeviceService from "../service/device.service";
import DeviceManager from "../temp_design_pattern/DeviceManager";
import logger from "../logger/logger";
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
            logger.info("MQTT client connected successfully...");
            await this.subscribeToAllFeeds(); // subscribe to all existing feeds
        });

        this.client.on("message", async (topic, message) => {
            logger.info(`Receive message from ${topic}: ${message.toString()}`);
            await deviceManager.updateDeviceStatus(topic, message.toString());
        });

        this.client.on("error", (err) => {
            logger.error("MQTT Connection error: ", err);
            this.client.end();
        });

        this.client.on("close", () => {
            logger.info("MQTT Connection close");
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
                            logger.info(`Subscribed to new feed: ${feed}`);
                        } else {
                            logger.error(`Error when subcribing to feed ${feed}`);
                        }
                    });
                } else {
                    logger.info(`Already subscribed to feed: ${feed}`);
                }
            } else {
                logger.error("Client hasn't connected yet");
            }
        } catch (error) {
            logger.error(error);
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
                            logger.info(`Unsubscribe feed ${feed} successfully`);
                        } else {
                            logger.error(`Error when unsubcribing feed ${feed}`);
                        }
                    });
                } else {
                    logger.info(`Feed: ${feed} not found`);
                }
            } else {
                logger.error("Client hasn't connected yet");
            }
        } catch (error) {
            logger.error(error);
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
                                        logger.error(`Error when subcribing to feed ${feed}`);
                                    }
                                });
                                logger.info(`Subscribed to new feed: ${feed}`);
                            } else {
                                logger.warn(`Already subscribed to feed: ${feed}`);
                            }
                        }
                    } else {
                        logger.info("No feeds found");
                    }
                } else {
                    logger.error("MQTTClient does not have deviceService");
                }
            } else {
                logger.error("Client hasn't connected yet");
            }
        } catch (error) {
            logger.error("Error fetching feeds from database:", error);
        }
    }

    public async publishMessage(feed: string, value: number) {
        // console.log(typeof value);
        logger.info(`MQTT Client publishes to topic ${feed} with value: ${value}`);
        await this.client.publishAsync(feed, value.toString());
    }
}

export default MQTTService;
