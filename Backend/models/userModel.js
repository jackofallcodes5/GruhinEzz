const { pool } = require("../config/db");

// role is always one of "buyer" | "seller" | "ngo" (matches frontend contract)

async function findByEmail(email) {
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE email = $1 LIMIT 1",
    [email]
  );
  return rows[0] || null;
}

async function findByEmailAndRole(email, role) {
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE email = $1 AND role = $2 LIMIT 1",
    [email, role]
  );
  return rows[0] || null;
}

async function createUser({ role, userName, email, passwordHash, contactNo }) {
  const isVerified = role === "buyer";
  const { rows } = await pool.query(
    `INSERT INTO users (role, user_name, email, password_hash, contact_no, is_verified)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, role, user_name AS "userName", email, contact_no AS "contactNo", is_verified AS "isVerified"`,
    [role, userName, email, passwordHash, contactNo, isVerified]
  );
  return rows[0];
}

async function findById(id) {
  const { rows } = await pool.query(
    `SELECT id, role, user_name, email, contact_no, is_verified
     FROM users WHERE id = $1 LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

async function markUserVerified(userId) {
  await pool.query(
    "UPDATE users SET is_verified = TRUE, updated_at = NOW() WHERE id = $1",
    [userId]
  );
}

async function createVerificationSession(userId, sessionToken, expiryDays = 7) {
  const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);
  await pool.query(
    `INSERT INTO user_verifications (user_id, session_token, is_verified, expires_at)
     VALUES ($1, $2, TRUE, $3)
     ON CONFLICT (user_id)
     DO UPDATE SET session_token = EXCLUDED.session_token,
                   expires_at    = EXCLUDED.expires_at,
                   is_verified   = TRUE`,
    [userId, sessionToken, expiresAt]
  );
  return { sessionToken, expiresAt };
}

async function getVerificationSession(sessionToken) {
  const { rows } = await pool.query(
    `SELECT uv.session_token, uv.expires_at, uv.is_verified AS session_verified,
            u.id, u.role, u.user_name, u.email, u.contact_no, u.is_verified
     FROM user_verifications uv
     JOIN users u ON u.id = uv.user_id
     WHERE uv.session_token = $1 AND uv.is_verified = TRUE AND uv.expires_at > NOW()
     LIMIT 1`,
    [sessionToken]
  );
  return rows[0] || null;
}

module.exports = {
  findByEmail,
  findByEmailAndRole,
  createUser,
  findById,
  markUserVerified,
  createVerificationSession,
  getVerificationSession,
};
