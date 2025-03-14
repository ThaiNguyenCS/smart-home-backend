import dotenv from "dotenv";
dotenv.config(); 
import express from "express";
import { DB_CONFIG, PORT } from "./config/config";
import morgan from "morgan";
import authRouter from "./routes/authenticate.route";
import deviceRouter from "./routes/device.route";
import sequelize from "./model/database";
// import "./scheduler";
import "./model/association";
import { deviceManager } from "./config/container";
import systemRuleRouter from "./routes/system-rule.route";
// import Action from "./model/Action.model";
// import Room from "./model/Room.model";
// import Floor from "./model/Floor.model";
// import RealEstate from "./model/RealEstate.model";
// import DeviceAttribute from "./model/DeviceAttribute.model";
// DeviceAttribute.sync()
// RealEstate.sync()
// Action.sync();
// Floor.sync()
// Room.sync()
const app = express();

app.use(express.json()); // to read json format from request's body
app.use(morgan("dev")); // logger
app.use("/auth", authRouter);
app.use("/devices", deviceRouter);
app.use("/system-rules", systemRuleRouter);

(async () => {
    try {
        await sequelize.authenticate();
        // await sequelize.sync({ alter: true });
        console.log("Database exists and connection successful");
        await deviceManager.loadDevicesFromDB(); // load devices from DB into RAM
        // const mqttService = MQTTService.getInstance();
        app.listen(PORT, () => {
            console.log(`Server's running at ${PORT}`);
        });
    } catch (error: any) {
        console.error(error.message);
    }
})();
