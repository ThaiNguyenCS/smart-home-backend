import express from "express";

const router = express.Router();

router.get("/test", async (req, res) => {
    res.status(200).send({ message: "test successfully" });
});

router.post("/login", async (req, res) => {
    res.status(200).send({ message: "login successfully" });
});


router.post("/register", async (req, res) => {
    res.status(200).send({ message: "login successfully" });
});


export default router;