import express from "express";
import { PORT } from "./config/config";
import morgan from "morgan";
import authRouter from "./routes/authenticate.route";
const app = express();

app.use(morgan("dev"));

app.use("/auth", authRouter);

app.listen(PORT, () => {
    console.log(`Server's running at ${PORT}`);
});
