const mqtt = require("mqtt");

// Adafruit IO credentials
const AIO_USERNAME = "phngngoc";
const AIO_KEY = "aio_PCOY61LKfq3WgRDm4VUTqpuDTDVB";
const AIO_FEED_ID = "temp";
const LIGHT_AIO_FEED_ID = "light";

// MQTT broker URL for Adafruit IO
const MQTT_URL = `mqtts://${AIO_USERNAME}:${AIO_KEY}@io.adafruit.com`;

// Connect to Adafruit IO
const client = mqtt.connect(MQTT_URL);

// When connected
client.on("connect", () => {
    console.log("Ket noi thanh cong ...");
    client.subscribe(`${AIO_USERNAME}/feeds/${AIO_FEED_ID}`, (err) => {
        if (!err) {
            console.log("Subscribe temp thanh cong ...");
        }
    });
    client.subscribe(`${AIO_USERNAME}/feeds/${LIGHT_AIO_FEED_ID}`, (err) => {
        if (!err) {
            console.log("Subscribe light thanh cong ...");
        }
    });
});

// When a message is received
client.on("message", (topic,payload, packet) => {
    console.log(topic)
    console.log(payload)
    console.log(packet)
    // console.log(`Nhan du lieu: ${topic} ${message.toString()}`);
    
});


// client.on("message", (topic, message) => {
//     console.log(`Nhan du lieu: ${topic} ${message.toString()}`);
// });
// When disconnected
client.on("close", () => {
    console.log("Ngat ket noi ...");
    process.exit(1); // Exit program450
});
 
// Keep the program running
setInterval(() => {
}, 1000);
