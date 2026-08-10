const express = require("express");
const { signup, login, me } = require("../controllers/authController");
const { sendOtp, verifyOtpHandler } = require("../controllers/otpController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", requireAuth, me); // used by the dashboard to confirm the session

// OTP — no auth required (called right after signup/login, before token is stored)
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtpHandler);

module.exports = router;
