import { Request, Response, Router } from "express";
import { scheduleController } from "../config/container";
import { validateToken } from "../middleware/authenticate.middleware";

const router = Router();

router.use(validateToken);
router.get("/:id", scheduleController.getSchedule);
router.put("/:id", scheduleController.updateSchedule);
router.delete("/:id", scheduleController.deleteSchedule);
router.post("/", scheduleController.addSchedule);
router.get("/", scheduleController.getAllSchedules);

export default router;
