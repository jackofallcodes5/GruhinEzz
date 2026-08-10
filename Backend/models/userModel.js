const { pool } = require("../config/db");

// role is always one of "buyer" | "seller" | "ngo" (matches frontend contract)

async function findByEmail(email) {
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [email]
  );
  return rows[0] || null;
}

async function findByEmailAndRole(email, role) {
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email = ? AND role = ? LIMIT 1",
    [email, role]
  );
  return rows[0] || null;
}

async function createUser({ role, userName, email, passwordHash, contactNo }) {
  const [result] = await pool.query(
    `INSERT INTO users (role, user_name, email, password_hash, contact_no)
     VALUES (?, ?, ?, ?, ?)`,
    [role, userName, email, passwordHash, contactNo]
  );
  return {
    id: result.insertId,
    role,
    userName,
    email,
    contactNo,
  };
}

async function findById(id) {
  const [rows] = await pool.query(
    "SELECT id, role, user_name, email, contact_no FROM users WHERE id = ? LIMIT 1",
    [id]
  );
  return rows[0] || null;
}

module.exports = {
  findByEmail,
  findByEmailAndRole,
  createUser,
  findById,
};
