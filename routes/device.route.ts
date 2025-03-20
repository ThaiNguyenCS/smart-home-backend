import express from "express";
import { deviceController } from "../config/container";
import { validateToken } from "../middleware/authenticate.middleware";
import { authorizeRoles } from "../middleware/role.middleware";
const router = express.Router();

// router.post("/test-blocking", deviceController.test);
// router.post("/test-blocking2", deviceController.test2);

router.post("/:id/attribute/:attrId/control", validateToken, authorizeRoles("USER"), deviceController.controlDeviceAttr);

// ADMIN: update a device attribute
router.patch("/:id/attribute/:attrId", validateToken, authorizeRoles("ADMIN"), deviceController.updateDeviceAttr);
// ADMIN: delete a device attribute
router.delete("/:id/attribute/:attrId", validateToken, authorizeRoles("ADMIN"), deviceController.deleteDeviceAttr);

// delete a schedule of a device
router.delete("/:id/schedules/:scheduleId", validateToken, deviceController.deleteDeviceSchedule);
// update a schedule of a device
router.patch("/:id/schedules/:scheduleId", validateToken, deviceController.updateDeviceSchedule);

// ADMIN: add device attribute
router.post("/:id/attribute", validateToken, authorizeRoles("ADMIN"), deviceController.addDeviceAttr);
// get schedules for a device
router.get("/:id/schedules", validateToken, deviceController.getDeviceSchedules);
// create a schedule for a device
router.post("/:id/schedules", validateToken, deviceController.createDeviceSchedule);

// get all devices (for 1 user)
router.get("/all", validateToken, deviceController.getAllDevices);
// reload device (for 1 user)
// router.get("/reload", deviceController.reloadDevices);
// get a specific device
router.get("/:id", validateToken, deviceController.getDevice);
// update a device info
router.patch("/:id", validateToken, deviceController.updateDevice);

// delete a specific device
router.delete("/:id", validateToken, deviceController.removeDevice);

// ADMIN: add new device
router.post("/", validateToken, authorizeRoles("ADMIN"), deviceController.addDevice);

export default router;
