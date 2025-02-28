import express from "express";
const router = express.Router();

router.get("/test", async (req, res) => {
    res.status(200).send({ message: "test successfully" });
});

export default router;
