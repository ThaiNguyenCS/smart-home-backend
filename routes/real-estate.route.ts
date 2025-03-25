import express, { NextFunction, Request } from "express";
import { realEstateController } from "../config/container";
import { AuthenticatedRequest, validateToken } from "../middleware/authenticate.middleware";
const router = express.Router();

router.use(validateToken);

// get all real estate of a user
router.get("/all", realEstateController.getAllEstateByUser);

//get all rooms of estate
router.get("/rooms/:id", realEstateController.getAllRoom);

// delete a real estate (with limitation)
router.delete("/:id", realEstateController.deleteEstate);
// modify a real estate info
router.patch("/:id", realEstateController.updateEstate);
// add new real estate
router.post("/", realEstateController.createEstate);

export default router;
