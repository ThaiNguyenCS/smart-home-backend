import express from "express";
import { validateToken } from "../middleware/authenticate.middleware";
import { statController } from "../config/container";
const router = express.Router();

router.get("/", validateToken, statController.getStats);

export default router;
