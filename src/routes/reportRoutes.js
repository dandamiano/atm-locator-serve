const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportsController");

router.get("/atm-summary", reportController.getATMOperationalSummary);
router.get("/services-distribution", reportController.getATMServicesDistribution);
router.get("/queue-report", reportController.getQueueWaitTimeReport);
router.get("/feedback-analysis", reportController.getUserFeedbackAnalysis);
router.get("/preferences-report", reportController.getUserPreferencesReport);

module.exports = router;
