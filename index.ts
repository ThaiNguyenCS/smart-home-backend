import http from "http";
import express from "express";
import { PORT } from "./config/config";
import morgan from "morgan";
import authRouter from "./routes/authenticate.route";
import deviceRouter from "./routes/device.route";
import sequelize from "./model/database";
import "./scheduler";
import "./model/association";
import cors from "cors";
import { deviceManager } from "./config/container";
import systemRuleRouter from "./routes/system-rule.route";
import notificationRouter from "./routes/notification.route";
import { initWebSocket } from "./service/web-socket.service";
import logger from "./logger/logger";
import { globalErrorHandler } from "./errors/ErrorHandler";
import deviceLogRouter from "./routes/deviceLog.route";
import realEstateRouter from "./routes/real-estate.route";
import floorRouter from "./routes/floor.route";
import roomRouter from "./routes/room.route";
import scheduleRouter from "./routes/schedule.route";
import { spawn } from "child_process";
import { convertVoiceCommandToAction } from "./utils/speech-action";
// import Action from "./model/Action.model";
// import Room from "./model/Room.model";
// import Floor from "./model/Floor.model";
// import Device from "./model/Device.model";
// import RealEstate from "./model/RealEstate.model";
// import DeviceAttribute from "./model/DeviceAttribute.model";
// Device.sync()
// DeviceAttribute.sync()
// RealEstate.sync()
// Action.sync();

// Floor.sync()
// Room.sync()

const app = express();

app.use(cors());

app.use(express.json()); // to read json format from request's body
app.use(morgan("dev")); // logger
app.use("/auth", authRouter);
app.use("/devices", deviceRouter);
app.use("/system-rules", systemRuleRouter);
app.use("/notifications", notificationRouter);
app.use("/logs", deviceLogRouter);
app.use("/estates", realEstateRouter);
app.use("/floors", floorRouter);
app.use("/rooms", roomRouter);
app.use("/schedules", scheduleRouter);


//TODO: for testing only
// app.get("/recognize", async (req, res) => {
//     console.log("Starting Python speech recognition...");

//     const pythonProcess = spawn("python", ["speech.py"]);

//     pythonProcess.stdout.on("data", async (data) => {
//         console.log("data:", data);
//         const result = JSON.parse(data.toString().trim());
//         console.log("Recognized Text:", result);
//         try {
//             await convertVoiceCommandToAction(result);
//             res.status(200).send({ message: "Success" });
//         } catch (error) {
//             res.status(400).send({ message: "Unknown command" });
//         }
//     });
// });

app.use(globalErrorHandler);

(async () => {
    try {
        await sequelize.authenticate();
        // await sequelize.sync({ alter: true });
        logger.info("Database exists and connection successful");
        await deviceManager.loadDevicesFromDB(); // load devices from DB into RAM
        // const mqttService = MQTTService.getInstance();
        const server = http.createServer(app);
        initWebSocket(server);
        // setInterval(() => {
        //     sendWebSocketNotification("test", "fucking socket io");
        // }, 3000);

        server.listen(PORT, () => {
            logger.info(`Server's running at ${PORT}`);
        });
    } catch (error: any) {
        // console.error(error.message);
        logger.error(error.message);
        process.exit(1);
    }
})();
