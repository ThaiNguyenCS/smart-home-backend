import express from "express";
import AuthController from "../controller/auth.controller";

const router = express.Router();

router.post("/login", (req, res) => AuthController.loginByUsernameAndPass(req, res));
router.post("/register", (req, res) => AuthController.register(req, res));
router.post("/admin/register", (req, res) => AuthController.registerAdmin(req, res));
router.post("/forgetPassword", (req, res) => AuthController.forgotPassword(req, res));
router.post("/resetPassword", (req, res) => AuthController.resetPassword(req, res));
router.post("/updatePassword", (req, res) => AuthController.updatePassword(req, res));

export default router;
