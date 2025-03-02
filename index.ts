import express from "express";
import { PORT } from "./config/config";
import morgan from "morgan";
import authRouter from "./routes/authenticate.route";
import sequelize from "./model/database";
const app = express();

app.use(express.json());

app.use(morgan("dev"));

app.use("/auth", authRouter);

(async () => {
    try {
        // await sequelize.authenticate();
        await sequelize.sync();
        console.log("Database exists and connection successful");
    } catch (error) {
        console.log((error as any).message);
    }

    app.listen(PORT, () => {
        console.log(`Server's running at ${PORT}`);
    });
})();
