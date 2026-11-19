const express = require("express");
const router = express.Router();
const { getQueueData, handleQueueUpdate } = require("../controllers/queueController");

router.get("/", getQueueData);

router.post("/update", async (req, res) => {
  try {
    await handleQueueUpdate(req.body);
    res.status(201).json({ message: "Queue data saved successfully" });
  } catch (error) {
    console.error("[API ERROR]", error);
    res.status(500).json({ error: "Failed to save queue data" });
  }
});

module.exports = router;
