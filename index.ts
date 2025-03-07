import express from "express";
import { PORT } from "./config/config";
import morgan from "morgan";
import authRouter from "./routes/authenticate.route";
import deviceRouter from "./routes/device.route";
import sequelize from "./model/database";
// import "./scheduler";
import "./model/association";
import "./mqtt/subcriber"; // Importing starts the MQTT connection
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
        app.listen(PORT, () => {
            console.log(`Server's running at ${PORT}`);
        });
    } catch (error) {
        console.log((error as any).message);
    }
})();
