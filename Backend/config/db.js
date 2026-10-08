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
        upi_id              TEXT,
        auto_payout         BOOLEAN NOT NULL DEFAULT TRUE,
        created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    try { await client.query(`ALTER TABLE bank_setups ADD COLUMN IF NOT EXISTS upi_id TEXT`); } catch(e){}
    try { await client.query(`ALTER TABLE bank_setups ADD COLUMN IF NOT EXISTS auto_payout BOOLEAN NOT NULL DEFAULT TRUE`); } catch(e){}

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
        id                 SERIAL PRIMARY KEY,
        user_id            INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        seller_id          INT REFERENCES users(id) ON DELETE SET NULL,
        cf_order_id        TEXT NOT NULL UNIQUE,
        order_amount       NUMERIC(10,2) NOT NULL,
        order_currency     TEXT DEFAULT 'INR',
        payment_status     TEXT DEFAULT 'CREATED',
        payment_method     TEXT,
        fulfillment_status TEXT DEFAULT 'Processing',
        tracking_number    TEXT,
        customer_name      TEXT,
        customer_email     TEXT,
        customer_phone     TEXT,
        shipping_address   TEXT,
        shipping_city      TEXT,
        shipping_state     TEXT,
        shipping_pincode   TEXT,
        product_title      TEXT,
        product_image_url  TEXT,
        product_variant    TEXT,
        quantity           INT DEFAULT 1,
        unit_price         NUMERIC(10,2),
        created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    const orderAlterCols = [
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS seller_id INT REFERENCES users(id) ON DELETE SET NULL`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'CREATED'`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS fulfillment_status TEXT DEFAULT 'Processing'`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number TEXT`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address TEXT`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_city TEXT`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_state TEXT`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_pincode TEXT`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS product_image_url TEXT`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS product_variant TEXT`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS quantity INT DEFAULT 1`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS unit_price NUMERIC(10,2)`,
    ];
    for (const sql of orderAlterCols) {
      try { await client.query(sql); } catch(e) { /* already exists */ }
    }

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


    // 12. seller_settings (Shipping & Store Rules per seller)
    await client.query(`
      CREATE TABLE IF NOT EXISTS seller_settings (
        id                SERIAL PRIMARY KEY,
        user_id           INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        shipping_fee      NUMERIC(10,2) DEFAULT 40,
        free_threshold    NUMERIC(10,2) DEFAULT 499,
        dispatch_time     TEXT DEFAULT '24-48 Hours',
        return_policy     TEXT DEFAULT '7-Day Replacement Guarantee',
        cod_allowed       BOOLEAN DEFAULT TRUE,
        whatsapp_alerts   BOOLEAN DEFAULT TRUE,
        sms_alerts        BOOLEAN DEFAULT TRUE,
        email_invoices    BOOLEAN DEFAULT TRUE,
        created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 13. seller_earnings (Live balance tracker per seller)
    await client.query(`
      CREATE TABLE IF NOT EXISTS seller_earnings (
        id                SERIAL PRIMARY KEY,
        user_id           INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        available_balance NUMERIC(12,2) NOT NULL DEFAULT 0,
        total_revenue     NUMERIC(12,2) NOT NULL DEFAULT 0,
        withdrawn_amount  NUMERIC(12,2) NOT NULL DEFAULT 0,
        updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 14. transactions (Cashfree credit/payout ledger)
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id          SERIAL PRIMARY KEY,
        user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        txn_ref     TEXT NOT NULL UNIQUE,
        description TEXT,
        type        TEXT NOT NULL CHECK (type IN ('CREDIT','PAYOUT')),
        amount      NUMERIC(12,2) NOT NULL,
        status      TEXT DEFAULT 'Settled',
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // ── Seed demo data for user_id = 10 (Sunita Sharma – Seller) ──────────────
    await seedDemoData(client);
    console.log("✅ Database schema initialized (Supabase/PostgreSQL)");


  } catch (err) {
    console.warn("⚠️  Schema init warning:", err.message);
  } finally {
    client.release();
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Seed demo data for user_id = 10 (runs only if rows don't already exist)
// ──────────────────────────────────────────────────────────────────────────────
async function seedDemoData(client) {
  // Guard: only seed if user 10 doesn't already exist
  const { rows: existing } = await client.query(`SELECT id FROM users WHERE id = 10 LIMIT 1`);
  if (existing.length > 0) return;

  // Temporarily disable seq sync so we can INSERT with explicit id = 10
  await client.query(`SELECT setval(pg_get_serial_sequence('users','id'), GREATEST(10, (SELECT COALESCE(MAX(id),0) FROM users)))`);

  // 1. User row (seller, id forced to 10 via sequence trick)
  await client.query(`
    INSERT INTO users (id, role, user_name, email, password_hash, contact_no, is_verified)
    VALUES (10, 'seller', 'Sunita Sharma', 'sunita.sharma@gruhinezz.dev',
            '$2b$10$dummyhashplaceholderXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
            '+919876543210', TRUE)
    ON CONFLICT (id) DO NOTHING
  `);

  // 2. Seller profile
  await client.query(`
    INSERT INTO seller_profiles (user_id, full_name, email, phone, gender, address, city, state, pincode, id_type, id_number)
    VALUES (10,'Sunita Sharma','sunita.sharma@gruhinezz.dev','+919876543210','Female',
            'B-14, Vaishali Nagar','Jaipur','Rajasthan','302021','Aadhaar','1234-5678-9012')
    ON CONFLICT (user_id) DO NOTHING
  `);

  // 3. Business setup
  await client.query(`
    INSERT INTO business_setups (user_id, store_name, business_type, category, sub_category, description, years_in_business, num_employees, gst_number, store_address, city, state, pincode)
    VALUES (10, 'Sunita''s Traditional Rasoi', 'Home-Based Food', 'Homemade Foods', 'Pickles & Preserves',
            'Authentic Rajasthani pickles and preserves made with cold-pressed mustard oil and whole spices.',
            '5 Years', '1-5', 'GSTIN27AAAAA0000A1Z5',
            'B-14, Vaishali Nagar', 'Jaipur', 'Rajasthan', '302021')
    ON CONFLICT (user_id) DO NOTHING
  `);

  // 4. Bank setup
  await client.query(`
    INSERT INTO bank_setups (user_id, account_holder_name, account_number, ifsc_code, bank_name, branch_name, account_type, is_confirmed, cashfree_vendor_id, upi_id, auto_payout)
    VALUES (10, 'Sunita Sharma', '38920198425821', 'SBIN0004123', 'State Bank of India (SBI)',
            'Vaishali Nagar Branch', 'Savings', TRUE, 'vendor_10_cf', 'sunita.rasoi@okaxis', TRUE)
    ON CONFLICT (user_id) DO NOTHING
  `);

  // 5. Products (seller_id = 10)
  const p1 = await client.query(`
    INSERT INTO products (seller_id, title, description, price, original_price, discount_pct, category, image_url, images, stock, artisan_name, seller_name, seller_location, rating, review_count, is_active)
    VALUES (10, 'Handcrafted Organic Mango Pickle (500g)',
            'Sun-dried raw mango pickle recipe from three generations. Naturally cured in cold-pressed mustard oil with authentic Rajasthani whole spices.',
            249, 349, 29, 'Homemade Foods',
            'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=60',
            '["https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80"]',
            120, 'Sunita Sharma', 'Sunita''s Traditional Rasoi', 'Jaipur, Rajasthan', 4.8, 214, TRUE)
    ON CONFLICT DO NOTHING RETURNING id
  `);
  const product1Id = p1.rows[0]?.id;

  const p2 = await client.query(`
    INSERT INTO products (seller_id, title, description, price, original_price, discount_pct, category, image_url, images, stock, artisan_name, seller_name, seller_location, rating, review_count, is_active)
    VALUES (10, 'Hand-Embroidered Silk Chanderi Dupatta',
            'Handwoven Chanderi silk dupatta with intricate Zari embroidery done by skilled artisan Sunita.',
            899, 1299, 31, 'Textiles & Weaving',
            'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500&auto=format&fit=crop&q=60',
            '["https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500&auto=format&fit=crop&q=60"]',
            45, 'Sunita Sharma', 'Sunita''s Traditional Rasoi', 'Jaipur, Rajasthan', 4.6, 87, TRUE)
    ON CONFLICT DO NOTHING RETURNING id
  `);
  const product2Id = p2.rows[0]?.id;

  const p3 = await client.query(`
    INSERT INTO products (seller_id, title, description, price, original_price, discount_pct, category, image_url, images, stock, artisan_name, seller_name, seller_location, rating, review_count, is_active)
    VALUES (10, 'Homemade Bilona Pure A2 Cow Ghee (1 Litre)',
            'Traditional bilona churned A2 cow ghee made from curd of local Gir cows. No additives.',
            1150, 1499, 23, 'Homemade Foods',
            'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=500&auto=format&fit=crop&q=60',
            '["https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=500&auto=format&fit=crop&q=60"]',
            60, 'Sunita Sharma', 'Sunita''s Traditional Rasoi', 'Jaipur, Rajasthan', 4.9, 341, TRUE)
    ON CONFLICT DO NOTHING RETURNING id
  `);
  const product3Id = p3.rows[0]?.id;

  // 6. Orders (buyer user_id = 1, seller_id = 10)
  const o1 = await client.query(`
    INSERT INTO orders (user_id, seller_id, cf_order_id, order_amount, payment_status, payment_method,
      fulfillment_status, tracking_number, customer_name, customer_email, customer_phone,
      shipping_address, shipping_city, shipping_state, shipping_pincode,
      product_title, product_image_url, product_variant, quantity, unit_price, created_at)
    VALUES (1, 10, 'CF-ORD-98421', 498, 'PAID', 'Cashfree UPI (Instant)',
      'Processing', 'DTDC-JP-892134', 'Aarav Sharma', 'aarav.sharma@example.com', '+919876543210',
      'Flat 402, Lotus Residency, Malviya Nagar', 'Jaipur', 'Rajasthan', '302017',
      'Handcrafted Organic Mango Pickle (500g)',
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=60',
      '500g Glass Jar • Traditional Spicy', 2, 249,
      NOW() - INTERVAL '12 hours')
    ON CONFLICT (cf_order_id) DO NOTHING RETURNING id
  `);

  await client.query(`
    INSERT INTO orders (user_id, seller_id, cf_order_id, order_amount, payment_status, payment_method,
      fulfillment_status, tracking_number, customer_name, customer_email, customer_phone,
      shipping_address, shipping_city, shipping_state, shipping_pincode,
      product_title, product_image_url, product_variant, quantity, unit_price, created_at)
    VALUES (1, 10, 'CF-ORD-98390', 899, 'PAID', 'Cashfree Credit Card',
      'Shipped', 'BLUEDART-BLR-4892', 'Meera Nair', 'meera.nair@example.com', '+919823456789',
      'Villa 12, Palm Meadows, Whitefield', 'Bengaluru', 'Karnataka', '560066',
      'Hand-Embroidered Silk Chanderi Dupatta',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500&auto=format&fit=crop&q=60',
      'Royal Maroon & Gold', 1, 899,
      NOW() - INTERVAL '36 hours')
    ON CONFLICT (cf_order_id) DO NOTHING
  `);

  await client.query(`
    INSERT INTO orders (user_id, seller_id, cf_order_id, order_amount, payment_status, payment_method,
      fulfillment_status, tracking_number, customer_name, customer_email, customer_phone,
      shipping_address, shipping_city, shipping_state, shipping_pincode,
      product_title, product_image_url, product_variant, quantity, unit_price, created_at)
    VALUES (1, 10, 'CF-ORD-98205', 1150, 'PAID', 'Cashfree NetBanking',
      'Delivered', 'DELHIVERY-DEL-3921', 'Rohit Agarwal', 'rohit.ag@example.com', '+919712345678',
      'B-22, Civil Lines', 'Gurugram', 'Haryana', '122001',
      'Homemade Bilona Pure A2 Cow Ghee (1 Litre)',
      'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=500&auto=format&fit=crop&q=60',
      '1000ml (1 Litre) Glass Jar', 1, 1150,
      NOW() - INTERVAL '3 days')
    ON CONFLICT (cf_order_id) DO NOTHING
  `);

  await client.query(`
    INSERT INTO orders (user_id, seller_id, cf_order_id, order_amount, payment_status, payment_method,
      fulfillment_status, tracking_number, customer_name, customer_email, customer_phone,
      shipping_address, shipping_city, shipping_state, shipping_pincode,
      product_title, product_image_url, product_variant, quantity, unit_price, created_at)
    VALUES (1, 10, 'CF-ORD-98011', 650, 'PAID', 'Cashfree UPI',
      'Delivered', 'INDIAPOST-KOL-9812', 'Shreya Sen', 'shreya.sen@example.com', '+919831122334',
      '74, Southern Avenue', 'Kolkata', 'West Bengal', '700029',
      'Handpainted Terracotta Clay Tea Set',
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=500&auto=format&fit=crop&q=60',
      'Kutchi Tribal Floral (Multicolor)', 1, 650,
      NOW() - INTERVAL '5 days')
    ON CONFLICT (cf_order_id) DO NOTHING
  `);

  // 7. Seller earnings
  await client.query(`
    INSERT INTO seller_earnings (user_id, available_balance, total_revenue, withdrawn_amount)
    VALUES (10, 14850, 28450, 9400)
    ON CONFLICT (user_id) DO NOTHING
  `);

  // 8. Transactions ledger
  const txns = [
    { ref: 'TXN-CF-90812', desc: 'Order CF-ORD-98421 (Organic Mango Pickle x2)', type: 'CREDIT', amount: 498,  hoursAgo: 12 },
    { ref: 'TXN-CF-90760', desc: 'Order CF-ORD-98390 (Silk Chanderi Dupatta)',   type: 'CREDIT', amount: 899,  hoursAgo: 36 },
    { ref: 'TXN-WD-90411', desc: 'Bank Transfer to SBI (A/C ••5821)',            type: 'PAYOUT', amount: 5000, hoursAgo: 90 },
    { ref: 'TXN-CF-90219', desc: 'Order CF-ORD-98011 (Terracotta Tea Set)',      type: 'CREDIT', amount: 650,  hoursAgo: 115 },
    { ref: 'TXN-WD-89940', desc: 'Bank Transfer to SBI (A/C ••5821)',            type: 'PAYOUT', amount: 4400, hoursAgo: 240 },
  ];
  for (const t of txns) {
    await client.query(`
      INSERT INTO transactions (user_id, txn_ref, description, type, amount, status, created_at)
      VALUES (10, $1, $2, $3, $4, 'Settled', NOW() - ($5 * INTERVAL '1 hour'))
      ON CONFLICT (txn_ref) DO NOTHING
    `, [t.ref, t.desc, t.type, t.amount, t.hoursAgo]);
  }

  // 9. Seller settings
  await client.query(`
    INSERT INTO seller_settings (user_id, shipping_fee, free_threshold, dispatch_time, return_policy, cod_allowed, whatsapp_alerts, sms_alerts, email_invoices)
    VALUES (10, 40, 499, '24-48 Hours', '7-Day Replacement Guarantee', TRUE, TRUE, TRUE, TRUE)
    ON CONFLICT (user_id) DO NOTHING
  `);

  console.log("🌱 Seeded demo data for user_id=10 (Sunita Sharma)");
}

async function testConnection(retries = 3, delayMs = 2000) {
  for (let i = 1; i <= retries; i++) {
    try {
      const client = await pool.connect();
      console.log("✅ Supabase/PostgreSQL connected");
      client.release();
      // Skip initTables because DDL locks on Supabase can cause the server to hang on restart.
      // await initTables();
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
