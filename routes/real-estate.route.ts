import express from "express";
const router = express.Router();

// get all rooms from a real estate
router.get("/:id/rooms");
// get all real estate of a user
router.get("/all", async (req, res) => {});
// delete a real estate (with limitation)
router.delete("/:id", async (req, res) => {});
// modify a real estate info
router.patch("/:id", async (req, res) => {});

// add new real estate
router.post("/", async (req, res) => {});

export default router;
