require("dotenv").config();
const { pool } = require("../config/db");
const fs = require("fs");
const path = require("path");

async function runMigrations() {
  const sqlPath = path.join(__dirname, "../sql/ngo_empowerment.sql");
  try {
    const sql = fs.readFileSync(sqlPath, "utf8");
    console.log("Running migrations...");
    await pool.query(sql);
    console.log("✅ Migrations executed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
  } finally {
    pool.end();
  }
}

runMigrations();
