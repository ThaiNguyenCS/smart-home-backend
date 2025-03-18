import express from "express";
import { deviceController } from "../config/container";
import { validateToken } from "../middleware/authenticate.middleware";
const router = express.Router();

router.post("/test-blocking", deviceController.test);
router.post("/test-blocking2", deviceController.test2);

// ADMIN: update a device attribute
router.patch("/:id/attribute/:attrId", deviceController.updateDeviceAttr);
// ADMIN: delete a device attribute
router.delete("/:id/attribute/:attrId", deviceController.deleteDeviceAttr);

// delete a schedule of a device
router.delete("/:id/schedules/:scheduleId", validateToken, deviceController.deleteDeviceSchedule);
// update a schedule of a device
router.patch("/:id/schedules/:scheduleId", validateToken, deviceController.updateDeviceSchedule);

// ADMIN: add device attribute
router.post("/:id/attribute", deviceController.addDeviceAttr);
// get schedules for a device
router.get("/:id/schedules", validateToken, deviceController.getDeviceSchedules);
// create a schedule for a device
router.post("/:id/schedules", validateToken, deviceController.createDeviceSchedule);

// get all devices (for 1 user)
router.get("/all", validateToken, deviceController.getAllDevices);
// reload device (for 1 user)
router.get("/reload", deviceController.reloadDevices);
// get a specific device
router.get("/:id", validateToken, deviceController.getDevice);
// update a device info
router.patch("/:id", validateToken, deviceController.updateDevice);

// delete a specific device
router.delete("/:id", deviceController.removeDevice);

router.get("/:realEstateId");

// ADMIN: add new device
router.post("/", deviceController.addDevice);

export default router;
