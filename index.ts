import express from "express";
import { PORT } from "./config/config";
import morgan from "morgan";
import authRouter from "./routes/authenticate.route";
import deviceRouter from "./routes/device.route";
import sequelize from "./model/database";
// import "./scheduler";
import "./model/association";
import DeviceManager from "./temp_design_pattern/DeviceManager";
import MQTTService from "./service/mqtt.service";
// import Room from "./model/Room.model";
// import Floor from "./model/Floor.model";
// import RealEstate from "./model/RealEstate.model";
// import DeviceAttribute from "./model/DeviceAttribute.model";
// DeviceAttribute.sync()
// RealEstate.sync()
// Floor.sync()
// Room.sync()
const app = express();

app.use(express.json()); // to read json format from request's body
app.use(morgan("dev")); // logger
app.use("/auth", authRouter);
app.use("/devices", deviceRouter);

(async () => {
    try {
        await sequelize.authenticate();
        // await sequelize.sync({ alter: true });
        console.log("Database exists and connection successful");
        const deviceManager = DeviceManager.getInstance(); // get singleton instance of device manager
        await deviceManager.loadDevicesFromDB(); // load devices from DB into RAM
        const mqttService = MQTTService.getInstance();
        await mqttService.subscribeToFeeds();
        app.listen(PORT, () => {
            console.log(`Server's running at ${PORT}`);
        });
    } catch (error: any) {
        console.error(error.message);
    }
})();
