import express from "express";
import AuthController from "../controller/auth.controller";

const router = express.Router();

router.post("/login", AuthController.loginByUsernameAndPass);

router.post("/register", async (req, res) => {
    res.status(200).send({ message: "login successfully" });
});


export default router;