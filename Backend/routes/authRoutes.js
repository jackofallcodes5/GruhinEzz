const express = require("express");
const { signup, login, checkSession, logout, me } = require("../controllers/authController");
const { sendOtp, verifyOtpHandler } = require("../controllers/otpController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/check-session", checkSession);
router.post("/logout", logout);
router.get("/me", requireAuth, me);

// OTP Verification endpoints
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtpHandler);

module.exports = router;
