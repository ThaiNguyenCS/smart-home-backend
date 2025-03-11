import express from "express";
import { systemRuleController } from "../config/container";
const router = express.Router();


router.delete("/:id", async (req, res) => {});
router.put("/:id", async (req, res) => {});
router.get("/all", async (req, res) => {});
router.post("/", systemRuleController.addRule);

export default router;
