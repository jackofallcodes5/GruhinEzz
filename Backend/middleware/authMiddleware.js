const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");

/**
 * requireAuth
 * 1. Reads Bearer token from Authorization header.
 * 2. Verifies the JWT signature and expiry.
 * 3. Looks up the user ID from the token payload in the database.
 * 4. If the user does not exist (deleted account, stale token), returns 401
 *    and clears the auth cookie.
 * 5. Attaches the fresh DB user record to req.user.
 */
async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Authentication required." });
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET || "gruhinezz_jwt_secret_key");
  } catch (err) {
    res.clearCookie("gruhinezz_session");
    return res.status(401).json({ message: "Invalid or expired token." });
  }

  try {
    const { rows } = await pool.query(
      `SELECT id, role, user_name, email, contact_no, is_verified
       FROM users WHERE id = $1 LIMIT 1`,
      [payload.id]
    );

    if (rows.length === 0) {
      // User was deleted or token is for a non-existent account
      res.clearCookie("gruhinezz_session");
      return res.status(401).json({ message: "Account not found. Please log in again." });
    }

    req.user = {
      id: rows[0].id,
      role: rows[0].role,
      userName: rows[0].user_name,
      email: rows[0].email,
      contactNo: rows[0].contact_no,
      isVerified: Boolean(rows[0].is_verified),
    };

    next();
  } catch (err) {
    console.error("requireAuth DB error:", err);
    return res.status(500).json({ message: "Authentication check failed." });
  }
}

/**
 * requireRole(...allowedRoles)
 * Returns middleware that checks req.user.role against the allowed roles.
 * Must be used after requireAuth.
 *
 * Usage:
 *   router.get("/products", requireAuth, requireRole("seller"), handler);
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. This endpoint is restricted to: ${allowedRoles.join(", ")}.`,
      });
    }
    next();
  };
}

/**
 * requireVerified
 * After requireAuth, ensures the seller/ngo account has been admin-verified.
 * Buyers are always considered verified.
 */
function requireVerified(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required." });
  }
  if (req.user.role === "buyer") {
    return next();
  }
  if (!req.user.isVerified) {
    return res.status(403).json({
      message:
        "Your account is currently under verification. You will get access once approved by the Admin.",
      isVerified: false,
    });
  }
  next();
}

module.exports = { requireAuth, requireRole, requireVerified };
