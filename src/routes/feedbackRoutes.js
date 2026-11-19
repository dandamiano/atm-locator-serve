const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");

// Routes
router.post("/", feedbackController.addFeedback);
router.get("/", feedbackController.getAllFeedbacks);
router.get("/:atm_id", feedbackController.getFeedbackByATM);
router.put("/:id", feedbackController.updateFeedbackStatus);
router.delete("/:id", feedbackController.deleteFeedback);
router.get("/userFeedback/:user_email", feedbackController.getFeedbackByUser);

module.exports = router;
