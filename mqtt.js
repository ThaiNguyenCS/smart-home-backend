const mqtt = require("mqtt");

// Adafruit IO credentials
const AIO_USERNAME = "phngngoc";
const AIO_KEY = "aio_PCOY61LKfq3WgRDm4VUTqpuDTDVB";
const AIO_FEED_ID = "temp";

// MQTT connection URL
const MQTT_URL = `mqtts://${AIO_USERNAME}:${AIO_KEY}@io.adafruit.com`;

// Connect to Adafruit IO MQTT broker
const client = mqtt.connect(MQTT_URL);

client.on("connect", () => {
    console.log("Connected successfully...");
    client.subscribe(`${AIO_USERNAME}/feeds/${AIO_FEED_ID}`, (err) => {
        if (!err) {
            console.log("Subscribed successfully...");
        }
    });
});

client.on("message", (topic,payload, packet) => {
    // console.log(topic)
    // console.log(payload)
    // console.log(packet)
    console.log(`Received data: ${payload.toString()}`);
});

client.on("error", (err) => {
    console.error("Connection error: ", err);
    client.end();
});

client.on("close", () => {
    console.log("Disconnected...");
});

// Publish random values every 30 seconds
client.publish(`${AIO_USERNAME}/feeds/fan`, "0");


