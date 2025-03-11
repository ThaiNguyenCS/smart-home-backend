import express from "express";
import { deviceController } from "../config/container";
const router = express.Router();

// update a device attribute
router.patch("/:id/attribute/:attrId", deviceController.updateDeviceAttr);
// delete a device attribute
router.delete("/:id/attribute/:attrId", deviceController.deleteDeviceAttr);
// add device attribute
router.post("/:id/attribute", deviceController.addDeviceAttr);
// get all devices (for 1 user)
router.get("/all", deviceController.getAllDevices);
// reload device (for 1 user)
router.get("/reload", deviceController.reloadDevices);
// get a specific device
router.get("/:id", deviceController.getDevice);
// update a device info
router.patch("/:id", deviceController.updateDevice);

// delete a specific device
router.delete("/:id", deviceController.removeDevice);

router.get("/:realEstateId");

// add new device
router.post("/", deviceController.addDevice);

export default router;
