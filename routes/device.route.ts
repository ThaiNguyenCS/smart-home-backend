import express from "express";
import Device from "../temp_design_pattern/Device";
import DeviceController from "../controller/device.controller";
const router = express.Router();

// add device attribute
router.post("/:id/attribute", DeviceController.addDeviceAttr);
router.get("/all", DeviceController.getAllDevices);
router.get("/:id", DeviceController.getDevice)
router.delete("/:id", DeviceController.removeDevice);

router.get("/:realEstateId");

router.get("/:feed", async (req, res) => {});

// post an action to a device
router.post("/:feed");

// add new device
router.post("/", DeviceController.addDevice);
// remove a device

export default router;
