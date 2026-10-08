-- GruhinEzz Database Schema: E-Commerce Platform for Household Women Entrepreneurs
-- Note: The live database is PostgreSQL. This is a reference schema.

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  role          VARCHAR(50) NOT NULL, -- 'buyer', 'seller', 'ngo'
  user_name     TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  contact_no    TEXT NOT NULL,
  is_verified   BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 2. User Verifications Table
CREATE TABLE IF NOT EXISTS user_verifications (
  id            SERIAL PRIMARY KEY,
  user_id       INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  is_verified   BOOLEAN DEFAULT TRUE,
  verified_at   TIMESTAMPTZ DEFAULT NOW(),
  expires_at    TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Seller Profiles Table
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
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Business Setups Table
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
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Bank Setups Table
CREATE TABLE IF NOT EXISTS bank_setups (
  id                  SERIAL PRIMARY KEY,
  user_id             INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  account_holder_name TEXT NOT NULL,
  account_number      TEXT NOT NULL,
  ifsc_code           TEXT NOT NULL,
  bank_name           TEXT NOT NULL,
  branch_name         TEXT,
  account_type        TEXT,
  is_confirmed        BOOLEAN DEFAULT TRUE,
  cashfree_vendor_id  TEXT,
  upi_id              TEXT,
  auto_payout         BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Products Table
CREATE TABLE IF NOT EXISTS products (
  id               SERIAL PRIMARY KEY,
  seller_id        INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  description      TEXT,
  price            DECIMAL(10, 2) NOT NULL,
  original_price   DECIMAL(10, 2),
  discount_pct     INT DEFAULT 0,
  category         TEXT,
  image_url        TEXT,
  images           JSONB,
  stock            INT DEFAULT 10,
  artisan_name     TEXT,
  seller_name      TEXT,
  seller_location  TEXT,
  artisan_story    TEXT,
  rating           DECIMAL(3, 2) DEFAULT 4.5,
  review_count     INT DEFAULT 0,
  is_active        BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id                 SERIAL PRIMARY KEY,
  user_id            INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_id          INT REFERENCES users(id) ON DELETE SET NULL,
  cf_order_id        TEXT NOT NULL UNIQUE,
  order_amount       DECIMAL(10, 2) NOT NULL,
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
  unit_price         DECIMAL(10, 2),
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id              SERIAL PRIMARY KEY,
  order_id        TEXT NOT NULL,
  cf_payment_id   TEXT,
  payment_status  TEXT NOT NULL,
  payment_amount  DECIMAL(10, 2) NOT NULL,
  payment_method  TEXT,
  payment_time    TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);


-- 12. Seller Settings Table
CREATE TABLE IF NOT EXISTS seller_settings (
  id                SERIAL PRIMARY KEY,
  user_id           INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  shipping_fee      DECIMAL(10, 2) DEFAULT 40.00,
  free_threshold    DECIMAL(10, 2) DEFAULT 499.00,
  dispatch_time     TEXT DEFAULT '24-48 Hours',
  return_policy     TEXT DEFAULT '7-Day Replacement Guarantee',
  cod_allowed       BOOLEAN DEFAULT TRUE,
  whatsapp_alerts   BOOLEAN DEFAULT TRUE,
  sms_alerts        BOOLEAN DEFAULT TRUE,
  email_invoices    BOOLEAN DEFAULT TRUE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Seller Earnings Table
CREATE TABLE IF NOT EXISTS seller_earnings (
  id                SERIAL PRIMARY KEY,
  user_id           INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  available_balance DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  total_revenue     DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  withdrawn_amount  DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
  id          SERIAL PRIMARY KEY,
  user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  txn_ref     TEXT NOT NULL UNIQUE,
  description TEXT,
  type        TEXT NOT NULL, -- 'CREDIT' or 'PAYOUT'
  amount      DECIMAL(12, 2) NOT NULL,
  status      TEXT DEFAULT 'Settled',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Data is handled dynamically in Backend/config/db.js via seedDemoData() for user_id = 10.
