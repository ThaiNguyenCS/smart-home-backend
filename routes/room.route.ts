import express from "express";
import { validateToken } from "../middleware/authenticate.middleware";
import { roomController } from "../config/container";

const router = express.Router();

router.get("/:id", (req, res) => roomController.getAllRoomInFloor(req, res));
router.post("/", (req, res) => roomController.addRoom(req, res));
router.patch("/:id", (req, res) => roomController.updateRoom(req, res));
router.delete("/:id", (req, res) => roomController.deleteRoom(req, res));

export default router;
