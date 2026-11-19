const express = require("express");
const router = express.Router();
const atmController = require("../controllers/atmController");
const controller = require("../controllers/userPreferencesController");


// Routes
router.get("/", atmController.getAllATMs);
router.post("/", atmController.addATM);
router.put("/:id", atmController.updateATM);
router.delete("/:id", atmController.deleteATM);
router.patch("/:id", atmController.updateATMStatus);
// Save preferences for a specific user
router.post("/preferences/:userId", controller.savePreferences);

// Get preferences for a specific user
router.get("/preferences/:userId", controller.getPreferences);

module.exports = router;
