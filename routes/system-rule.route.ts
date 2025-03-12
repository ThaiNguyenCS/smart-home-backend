import express from "express";
import { systemRuleController } from "../config/container";
const router = express.Router();


router.post("/:ruleId/action", systemRuleController.addActionToRule);
router.put("/:id", async (req, res) => {});
router.delete("/:id", async (req, res) => {});
router.put("/:id", async (req, res) => {});
router.get("/all", systemRuleController.getAllRules);
router.post("/", systemRuleController.addRule);

export default router;
