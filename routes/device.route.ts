import express from "express";
import { deviceController } from "../config/container";
import { validateToken } from "../middleware/authenticate.middleware";
const router = express.Router();

// ADMIN: update a device attribute
router.patch("/:id/attribute/:attrId", deviceController.updateDeviceAttr);
// ADMIN: delete a device attribute
router.delete("/:id/attribute/:attrId", deviceController.deleteDeviceAttr);
// ADMIN: add device attribute
router.post("/:id/attribute", deviceController.addDeviceAttr);

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
