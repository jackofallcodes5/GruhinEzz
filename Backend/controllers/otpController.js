const { createOtp, verifyOtp } = require("../services/otpService");
const { sendOtpEmail } = require("../services/emailService");
const userModel = require("../models/userModel");

/**
 * POST /api/auth/send-otp
 *
 * Called after a successful login or signup response is confirmed on the
 * frontend. Generates a fresh OTP, stores it in memory, and emails it to
 * the user.
 *
 * Body: { email: string, userName?: string }
 */
async function sendOtp(req, res) {
  try {
    const { email, userName } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const otp = createOtp(email);

    try {
      await sendOtpEmail(email, otp, userName || "there");
    } catch (mailErr) {
      console.error("Email send failed:", mailErr.message);
      // Don't expose the OTP in the response — just tell the client
      return res.status(502).json({
        message:
          "Could not send the verification email. Check EMAIL_USER / EMAIL_PASS in your .env file.",
      });
    }

    console.log(`OTP for ${email}: ${otp}`); // DEV helper — remove in production
    return res.status(200).json({ message: "OTP sent successfully." });
  } catch (err) {
    console.error("send-otp error:", err);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

/**
 * POST /api/auth/verify-otp
 *
 * Verifies the OTP the user typed in. On success, returns the JWT token and
 * user object that were pre-computed during login/signup and stored in the
 * pending session.
 *
 * Body: { email: string, otp: string }
 */
async function verifyOtpHandler(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const result = verifyOtp(email, otp);

    if (!result.valid) {
      return res.status(400).json({ message: result.reason });
    }

    return res.status(200).json({ message: "OTP verified successfully." });
  } catch (err) {
    console.error("verify-otp error:", err);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

module.exports = { sendOtp, verifyOtpHandler };
