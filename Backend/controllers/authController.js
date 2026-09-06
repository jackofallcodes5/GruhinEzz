const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const VALID_ROLES = ["buyer", "seller", "ngo"];

function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || "gruhinezz_jwt_secret_key",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

// POST /api/auth/signup
async function signup(req, res) {
  try {
    const { role, userName, email, password, contactNo } = req.body;

    if (!role || !userName || !email || !password || !contactNo) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({ message: "Invalid role." });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters." });
    }

    const existing = await userModel.findByEmail(email);
    if (existing) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await userModel.createUser({
      role,
      userName,
      email,
      passwordHash,
      contactNo,
    });

    const token = signToken(user);

    return res.status(201).json({
      user: {
        id: String(user.id),
        role: user.role,
        userName: user.userName,
        email: user.email,
        contactNo: user.contactNo,
        isVerified: Boolean(user.isVerified),
      },
      token,
    });
  } catch (err) {
    console.error("signup error:", err);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { role, email, password } = req.body;

    if (!role || !email || !password) {
      return res.status(400).json({ message: "Role, email and password are required." });
    }
    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({ message: "Invalid role." });
    }

    const user = await userModel.findByEmailAndRole(email, role);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = signToken(user);

    return res.status(200).json({
      user: {
        id: String(user.id),
        role: user.role,
        userName: user.user_name,
        email: user.email,
        isVerified: Boolean(user.is_verified),
      },
      token,
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

// GET /api/auth/check-session
async function checkSession(req, res) {
  try {
    const sessionToken = req.cookies?.gruhinezz_session || req.headers.authorization?.replace("Bearer ", "");
    if (!sessionToken) {
      return res.status(200).json({ authenticated: false, isVerified: false });
    }

    const session = await userModel.getVerificationSession(sessionToken);
    if (!session) {
      return res.status(200).json({ authenticated: false, isVerified: false });
    }

    return res.status(200).json({
      authenticated: true,
      isVerified: true,
      user: {
        id: String(session.id),
        role: session.role,
        userName: session.user_name,
        email: session.email,
        contactNo: session.contact_no,
        isVerified: Boolean(session.is_verified),
      },
    });
  } catch (err) {
    console.error("checkSession error:", err);
    return res.status(200).json({ authenticated: false, isVerified: false });
  }
}

// POST /api/auth/logout
async function logout(req, res) {
  res.clearCookie("gruhinezz_session");
  return res.status(200).json({ message: "Logged out successfully." });
}

// GET /api/auth/me
async function me(req, res) {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json({
      user: {
        id: String(user.id),
        role: user.role,
        userName: user.user_name,
        email: user.email,
        contactNo: user.contact_no,
        isVerified: Boolean(user.is_verified),
      },
    });
  } catch (err) {
    console.error("me error:", err);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

module.exports = { signup, login, checkSession, logout, me };
