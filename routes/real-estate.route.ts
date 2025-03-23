import express from "express";
import { realEstateController } from "../config/container";
const router = express.Router();

//get all rooms of estate
router.get("/rooms/:id", (req, res) => realEstateController.getAllRoom(req, res));
// get all real estate of a user
router.get("/all/:id", (req, res) => realEstateController.getAllEstateByUser(req, res));
// delete a real estate (with limitation)
router.delete("/:id", (req, res) => realEstateController.deleteEstate(req, res));
// modify a real estate info
router.patch("/:id", (req, res) => realEstateController.updateEstate(req, res));
// add new real estate
router.post("/", (req, res) => realEstateController.createEstate(req, res));

export default router;
