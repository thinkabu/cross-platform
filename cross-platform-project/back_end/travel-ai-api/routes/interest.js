const express = require("express");
const router = express.Router();
const Interest = require("../models/Interests");

router.get("/", async (req, res) => {
    try {
        const interests = await Interest.find();
        res.status(200).json(interests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const { name, description } = req.body;

        // Kiểm tra nếu đã tồn tại interest
        const existingInterest = await Interest.find({ name });
        if (existingInterest.length > 0) {
            return res.status(400).json({ message: "Sở thích đã tồn tại" });
        }
        // Tạo sở thích mới
        const newInterest = new Interest({
            name,
            description,
        });
        const savedInterest = await newInterest.save();
        res.status(201).json(savedInterest);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;


