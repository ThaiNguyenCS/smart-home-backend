import express from "express";
import { systemRuleController } from "../config/container";
import { validateToken } from "../middleware/authenticate.middleware";
const router = express.Router();

router.use(validateToken);
// router.patch("/:ruleId/status", systemRuleController.updateRuleStatus);
router.post("/:ruleId/action", systemRuleController.addActionToRule);
router.get("/publishers", systemRuleController.getPublisherAttrs);
router.get("/subscribers", systemRuleController.getSubscriberAttrs);
router.patch("/:ruleId", systemRuleController.updateRuleInfo);
router.put("/:ruleId", systemRuleController.updateRule);

// delete a rule
router.delete("/:id", systemRuleController.deleteRule);
// get all rules
router.get("/all", systemRuleController.getAllRules);
// create a new rule
router.post("/", systemRuleController.addRule);

export default router;
