const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Public Routes
router.post("/register", userController.register);
router.post("/login", userController.login);

// Protected Routes (Require Admin)
// router.get("/", verifyToken, isAdmin, userController.getAllUsers);
router.get("/", userController.getAllUsers);
router.get("/adminProfile/:userId", userController.getAdminProfile);   


module.exports = router;
