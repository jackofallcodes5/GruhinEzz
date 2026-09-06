const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Missing or invalid authorization header." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "gruhinezz_jwt_secret_key");
    req.userId = payload.id;
    req.userRole = payload.role;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

async function requireVerified(req, res, next) {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Authentication required." });
    }
    // Buyers do not require admin verification
    if (req.userRole === "buyer") {
      return next();
    }

    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.is_verified) {
      return res.status(403).json({
        message: "Your account is currently under verification. Please review your submitted information. You will get access to your dashboard once your account is verified.",
        isVerified: false,
      });
    }

    next();
  } catch (err) {
    console.error("requireVerified error:", err);
    return res.status(500).json({ message: "Verification check failed." });
  }
}

module.exports = { requireAuth, requireVerified };
