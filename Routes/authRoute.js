const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');

router.post("/register", authController.registerUser)
router.get("/all", authController.getAllUsers)
router.post("/login", authController.loginUser)
router.post("/forget-password", authController.forgotPassword);
router.post("/verify-reset-code", authController.verifyResetCode);
router.post("/reset-password", authController.resetPassword);
router.post("/resend-code", authController.resendCode);

module.exports = router;