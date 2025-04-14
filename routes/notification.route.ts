import express from "express";
import { notificationController } from "../config/container";
import { validateToken } from "../middleware/authenticate.middleware";

const router = express.Router();
// TESTING PURPOSE ONLY

router.post("/", notificationController.createNotification);
router.use(validateToken)
router.delete("/:id", notificationController.deleteNotification);
router.patch("/:id", notificationController.acknowledgeNotification);
router.get("/", notificationController.getAllNotification);

export default router;
