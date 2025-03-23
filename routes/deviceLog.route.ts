import express from "express";
import { validateToken } from "../middleware/authenticate.middleware";
import { deviceLogController } from "../config/container";

const router = express.Router();

router.get("/:id", (req, res) => deviceLogController.getAllLogs(req, res));
router.post("/", (req, res) => deviceLogController.createLog(req, res));
router.delete("/:id", (req, res) => deviceLogController.deleteLog(req, res));

export default router;
