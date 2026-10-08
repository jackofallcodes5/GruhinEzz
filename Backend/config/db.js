const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // required for Supabase
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  keepAlive: true,
});

pool.on("error", (err) => {
  console.warn("⚠️ Unexpected error on idle DB client:", err.message);
});

// ──────────────────────────────────────────────────────────────────────────────
// Schema bootstrap — runs once on startup and creates any missing tables.
// All SQL is PostgreSQL / Supabase compatible.
// ──────────────────────────────────────────────────────────────────────────────
async function initTables() {
  const client = await pool.connect();
  try {
    // 1. users
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id            SERIAL PRIMARY KEY,
        role          TEXT NOT NULL CHECK (role IN ('buyer','seller','ngo')),
        user_name     TEXT NOT NULL,
        email         TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        contact_no    TEXT NOT NULL,
        is_verified   BOOLEAN NOT NULL DEFAULT FALSE,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 2. user_verifications (persistent OTP / cookie-session table)
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_verifications (
        id            SERIAL PRIMARY KEY,
        user_id       INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        session_token TEXT NOT NULL UNIQUE,
        is_verified   BOOLEAN NOT NULL DEFAULT TRUE,
        verified_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        expires_at    TIMESTAMPTZ NOT NULL,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE UNIQUE INDEX IF NOT EXISTS user_verifications_user_id_idx ON user_verifications (user_id);
    `);

    // 3. seller_profiles
    await client.query(`
      CREATE TABLE IF NOT EXISTS seller_profiles (
        id            SERIAL PRIMARY KEY,
        user_id       INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        full_name     TEXT NOT NULL,
        email         TEXT NOT NULL,
        phone         TEXT NOT NULL,
        alt_phone     TEXT,
        dob           DATE,
        gender        TEXT DEFAULT 'Female',
        address       TEXT,
        city          TEXT,
        state         TEXT,
        pincode       TEXT,
        id_type       TEXT,
        id_number     TEXT,
        id_proof_url  TEXT,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 4. business_setups
    await client.query(`
      CREATE TABLE IF NOT EXISTS business_setups (
        id                SERIAL PRIMARY KEY,
        user_id           INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        store_name        TEXT NOT NULL,
        business_type     TEXT,
        category          TEXT,
        sub_category      TEXT,
        description       TEXT,
        years_in_business TEXT,
        num_employees     TEXT,
        gst_number        TEXT,
        store_address     TEXT,
        city              TEXT,
        state             TEXT,
        pincode           TEXT,
        store_logo_url    TEXT,
        created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 5. bank_setups
    await client.query(`
      CREATE TABLE IF NOT EXISTS bank_setups (
        id                  SERIAL PRIMARY KEY,
        user_id             INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        account_holder_name TEXT NOT NULL,
        account_number      TEXT NOT NULL,
        ifsc_code           TEXT NOT NULL,
        bank_name           TEXT NOT NULL,
        branch_name         TEXT,
        account_type        TEXT,
        is_confirmed        BOOLEAN NOT NULL DEFAULT TRUE,
        cashfree_vendor_id  TEXT,
        created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 6. products (full schema with rich e-commerce fields)
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id               SERIAL PRIMARY KEY,
        seller_id        INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title            TEXT NOT NULL,
        description      TEXT,
        price            NUMERIC(10,2) NOT NULL,
        original_price   NUMERIC(10,2),
        discount_pct     INT DEFAULT 0,
        category         TEXT,
        image_url        TEXT,
        images           JSONB DEFAULT '[]',
        stock            INT DEFAULT 10,
        artisan_name     TEXT,
        seller_name      TEXT,
        seller_location  TEXT,
        artisan_story    TEXT,
        rating           NUMERIC(3,2) DEFAULT 4.5,
        review_count     INT DEFAULT 0,
        is_active        BOOLEAN DEFAULT TRUE,
        created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // Add missing columns to existing products tables (safe ALTER TABLE for upgrades)
    const productAlterCols = [
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS original_price NUMERIC(10,2)`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS discount_pct INT DEFAULT 0`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS seller_name TEXT`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS seller_location TEXT`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS artisan_story TEXT`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS rating NUMERIC(3,2) DEFAULT 4.5`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS review_count INT DEFAULT 0`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`,
    ];
    for (const sql of productAlterCols) {
      try { await client.query(sql); } catch (e) { /* column already exists */ }
    }

    // 7. orders
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id              SERIAL PRIMARY KEY,
        user_id         INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        cf_order_id     TEXT NOT NULL UNIQUE,
        order_amount    NUMERIC(10,2) NOT NULL,
        order_currency  TEXT DEFAULT 'INR',
        order_status    TEXT DEFAULT 'CREATED',
        customer_name   TEXT,
        customer_email  TEXT,
        customer_phone  TEXT,
        product_title   TEXT,
        created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 8. payments
    await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id              SERIAL PRIMARY KEY,
        order_id        TEXT NOT NULL,
        cf_payment_id   TEXT,
        payment_status  TEXT NOT NULL,
        payment_amount  NUMERIC(10,2) NOT NULL,
        payment_method  TEXT,
        payment_time    TEXT,
        created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 9. ngo_profiles
    await client.query(`
      CREATE TABLE IF NOT EXISTS ngo_profiles (
        id                 SERIAL PRIMARY KEY,
        user_id            INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        ngo_name           TEXT NOT NULL,
        registration_no    TEXT NOT NULL,
        ngo_type           TEXT NOT NULL,
        establishment_year TEXT NOT NULL,
        logo_url           TEXT,
        created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 10. ngo_contacts
    await client.query(`
      CREATE TABLE IF NOT EXISTS ngo_contacts (
        id                   SERIAL PRIMARY KEY,
        user_id              INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        official_email       TEXT NOT NULL,
        phone                TEXT NOT NULL,
        website              TEXT,
        registered_address   TEXT NOT NULL,
        operational_address  TEXT,
        contact_person_name  TEXT NOT NULL,
        designation          TEXT NOT NULL,
        contact_id_proof_url TEXT,
        created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 11. ngo_documents
    await client.query(`
      CREATE TABLE IF NOT EXISTS ngo_documents (
        id                SERIAL PRIMARY KEY,
        user_id           INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        reg_cert_url      TEXT NOT NULL,
        pan_card_url      TEXT NOT NULL,
        cert_80g_12a_url  TEXT,
        created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    console.log("✅ Database schema initialized (Supabase/PostgreSQL)");
  } catch (err) {
    console.warn("⚠️  Schema init warning:", err.message);
  } finally {
    client.release();
  }
}

async function testConnection(retries = 3, delayMs = 2000) {
  for (let i = 1; i <= retries; i++) {
    try {
      const client = await pool.connect();
      console.log("✅ Supabase/PostgreSQL connected");
      client.release();
      await initTables();
      return;
    } catch (err) {
      console.error(`❌ Database connection attempt ${i}/${retries} failed:`, err.message);
      if (i < retries) {
        console.log(`Retrying connection in ${delayMs / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      } else {
        process.exit(1);
      }
    }
  }
}

module.exports = { pool, testConnection };
