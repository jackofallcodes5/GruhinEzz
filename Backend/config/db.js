const { Pool } = require("pg");
require("dotenv").config();

// ── Database connection pool ──────────────────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // required for Supabase
  max: 20, 
  idleTimeoutMillis: 10000, // Eagerly close idle local connections BEFORE Supabase PgBouncer drops them
  connectionTimeoutMillis: 10000, // Give it a bit more time to connect
  keepAlive: true,
});

pool.on("error", (err) => {
  console.warn("⚠️ Unexpected error on idle DB client:", err.message);
});

// ── Connection test with retry ────────────────────────────────────────────────
async function testConnection(retries = 3, delayMs = 2000) {
  for (let i = 1; i <= retries; i++) {
    try {
      const client = await pool.connect();
      console.log("✅ Supabase/PostgreSQL connected");
      client.release();
      return;
    } catch (err) {
      console.error(`❌ Database connection attempt ${i}/${retries} failed:`, err.message);
      if (i < retries) {
        console.log(`Retrying in ${delayMs / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      } else {
        process.exit(1);
      }
    }
  }
}

module.exports = { pool, testConnection };
