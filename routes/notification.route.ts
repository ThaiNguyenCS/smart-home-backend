import express from "express";
import { notificationController } from "../config/container";
import { validateToken } from "../middleware/authenticate.middleware";

const router = express.Router();
router.use(validateToken)

router.delete("/:id", notificationController.deleteNotification);
router.patch("/:id", notificationController.acknowledgeNotification);
router.post("/", notificationController.createNotification);
router.get("/", notificationController.getAllNotification);

export default router;
