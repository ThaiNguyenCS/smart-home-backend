import express from "express";
import { validateToken } from "../middleware/authenticate.middleware";
import { floorController } from "../config/container";

const router = express.Router();

router.get("/:id", (req, res) =>  floorController.getAllFloorByEstate(req, res));
router.post("/", (req, res) => floorController.addFloor(req, res));
router.patch("/:id", (req, res) => floorController.updateFloor(req, res));
router.delete("/:id",(req, res) => floorController.deleteFloor(req, res));

export default router;
