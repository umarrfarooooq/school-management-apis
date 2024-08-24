const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');

// User registration and invitation
router.post("/register", authController.registerUser);
router.post("/invite-user", authController.inviteUser);
router.get("/initiate-signup/:inviteToken", authController.initiateSignup);
router.post("/complete-signup", authController.completeSignup);

// User management
router.get("/all", authController.getAllUsers);
router.get("/:id", authController.getUserById);
router.put("/update/:id", authController.updateUser);


// Login routes
router.post("/login", authController.loginUser);
router.post("/login-with-google", authController.loginWithGoogle);


// Password reset flow
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-reset-code", authController.verifyResetCode);
router.post("/reset-password", authController.resetPassword);
router.post("/resend-code", authController.resendCode);

module.exports = router;