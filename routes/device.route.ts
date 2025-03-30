import express, { NextFunction, Request } from "express";
import { deviceController } from "../config/container";
import { validateToken } from "../middleware/authenticate.middleware";
import { authorizeRoles } from "../middleware/role.middleware";
import multer from "multer";
import createHttpError from "http-errors";
const router = express.Router();

const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
    if (file.mimetype === "audio/wav" || file.originalname.toLowerCase().endsWith(".wav")) {
        cb(null, true); // Accept the file
    } else {
        cb(createHttpError(400, "Only WAV files are allowed"), false);
    }
};
const upload = multer({ storage: multer.memoryStorage(), fileFilter: fileFilter });

router.post(
    "/:id/attribute/:attrId/control",
    validateToken,
    authorizeRoles("USER"),
    deviceController.controlDeviceAttr
);

// ADMIN: update a device attribute
router.patch("/:id/attribute/:attrId", validateToken, authorizeRoles("ADMIN"), deviceController.updateDeviceAttr);
// ADMIN: delete a device attribute
router.delete("/:id/attribute/:attrId", validateToken, authorizeRoles("ADMIN"), deviceController.deleteDeviceAttr);

// delete a schedule of a device
// router.delete("/:id/schedules/:scheduleId", validateToken, deviceController.deleteDeviceSchedule);
// update a schedule of a device
// router.patch("/:id/schedules/:scheduleId", validateToken, deviceController.updateDeviceSchedule);

// ADMIN: add device attribute
router.post("/:id/attribute", validateToken, authorizeRoles("ADMIN"), deviceController.addDeviceAttr);
// get schedules for a device
router.get("/:id/schedules", validateToken, deviceController.getDeviceSchedules);
// create a schedule for a device
// router.post("/:id/schedules", validateToken, deviceController.createDeviceSchedule);

router.post(
    "/voice-control",
    validateToken,
    authorizeRoles("USER"),
    upload.single("file"),
    deviceController.voiceControlDevice
);

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
