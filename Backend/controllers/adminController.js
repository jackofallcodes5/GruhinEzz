const jwt = require("jsonwebtoken");
const adminModel = require("../models/adminModel");

// POST /api/admin/login
async function adminLogin(req, res) {
  try {
    const { email, password } = req.body;

    const envAdmin = process.env.ADMIN || "admin@gruhinezz.com";
    const envPass = process.env.ADMIN_PASS || "admin123";

    if (!email || !password) {
      return res.status(400).json({ message: "Admin email and password are required." });
    }

    if (email.trim().toLowerCase() !== envAdmin.trim().toLowerCase() || password !== envPass) {
      return res.status(401).json({ message: "Invalid Admin email or password." });
    }

    const token = jwt.sign(
      { role: "admin", email: envAdmin },
      process.env.JWT_SECRET || "gruhinezz_jwt_secret_key",
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Admin login successful",
      user: {
        role: "admin",
        email: envAdmin,
      },
      token,
    });
  } catch (err) {
    console.error("adminLogin error:", err);
    return res.status(500).json({ message: "Admin authentication failed." });
  }
}

// GET /api/admin/sellers
async function getSellers(req, res) {
  try {
    const sellers = await adminModel.getAllSellers();
    return res.status(200).json({ sellers });
  } catch (err) {
    console.error("getSellers error:", err);
    return res.status(500).json({ message: "Failed to fetch seller requests." });
  }
}

// GET /api/admin/ngos
async function getNgos(req, res) {
  try {
    const ngos = await adminModel.getAllNgos();
    return res.status(200).json({ ngos });
  } catch (err) {
    console.error("getNgos error:", err);
    return res.status(500).json({ message: "Failed to fetch NGO requests." });
  }
}

// POST /api/admin/verify-user
async function verifyUser(req, res) {
  try {
    const { userId, isVerified } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required for verification." });
    }

    const shouldVerify = isVerified !== undefined ? Boolean(isVerified) : true;
    await adminModel.updateVerificationStatus(userId, shouldVerify);

    return res.status(200).json({
      message: `User ${userId} verification status updated to ${shouldVerify ? "Verified" : "Pending"}.`,
      userId,
      isVerified: shouldVerify,
    });
  } catch (err) {
    console.error("verifyUser error:", err);
    return res.status(500).json({ message: "Failed to update user verification status." });
  }
}

module.exports = {
  adminLogin,
  getSellers,
  getNgos,
  verifyUser,
};
