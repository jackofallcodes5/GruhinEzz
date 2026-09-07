const crypto = require("crypto");
const { createOtp, verifyOtp } = require("../services/otpService");
const { sendOtpEmail } = require("../services/emailService");
const userModel = require("../models/userModel");

/**
 * POST /api/auth/send-otp
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
      // Fallback log for development
    }

    console.log(`🔑  OTP generated for ${email}: ${otp}`);
    return res.status(200).json({ message: "OTP sent successfully." });
  } catch (err) {
    console.error("send-otp error:", err);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

/**
 * POST /api/auth/verify-otp
 *
 * Verifies OTP and records user verification in MySQL `user_verifications` table.
 * Sets HTTP-only cookie so session persists until expiration without needing to log in again.
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

    // Fetch user from DB
    const user = await userModel.findByEmail(email);
    let sessionToken = "";

    if (user) {
      // Mark user verified in DB only if buyer (Sellers & NGOs remain unverified until Admin manual approval)
      if (user.role === "buyer") {
        await userModel.markUserVerified(user.id);
      }
      sessionToken = crypto.randomBytes(32).toString("hex");

      // Save to user_verifications table
      await userModel.createVerificationSession(user.id, sessionToken, 7);

      // Set persistent HTTP-only cookie
      res.cookie("gruhinezz_session", sessionToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: "lax",
      });
    }

    const dbUser = user ? await userModel.findById(user.id) : null;
    const isUserVerified = dbUser ? Boolean(dbUser.is_verified) : false;

    return res.status(200).json({
      message: "OTP verified successfully.",
      isVerified: isUserVerified,
      sessionToken,
      user: dbUser
        ? {
            id: String(dbUser.id),
            role: dbUser.role,
            userName: dbUser.user_name,
            email: dbUser.email,
            contactNo: dbUser.contact_no,
            isVerified: Boolean(dbUser.is_verified),
          }
        : null,
    });
  } catch (err) {
    console.error("verify-otp error:", err);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

module.exports = { sendOtp, verifyOtpHandler };
