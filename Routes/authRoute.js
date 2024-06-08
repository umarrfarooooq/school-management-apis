const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');

router.post("/register", authController.registerUser)
router.get("/all", authController.getAllUsers)
router.post("/login", authController.loginUser)

module.exports = router;