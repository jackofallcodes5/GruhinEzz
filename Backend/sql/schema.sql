-- GruhinEzz Database Schema: E-Commerce Platform for Household Women Entrepreneurs

CREATE DATABASE IF NOT EXISTS gruhinezz
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE gruhinezz;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  role          ENUM('buyer', 'seller', 'ngo') NOT NULL,
  user_name     VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  contact_no    VARCHAR(20)  NOT NULL,
  is_verified   TINYINT(1) DEFAULT 0,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. User Verifications Table (Persistent OTP & Cookie Verification Sessions)
CREATE TABLE IF NOT EXISTS user_verifications (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  session_token VARCHAR(255) NOT NULL UNIQUE,
  is_verified   TINYINT(1) DEFAULT 1,
  verified_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at    TIMESTAMP NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. Seller Profiles Table (KYC & Personal Info for Women Entrepreneurs)
CREATE TABLE IF NOT EXISTS seller_profiles (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL UNIQUE,
  full_name     VARCHAR(150) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  phone         VARCHAR(30) NOT NULL,
  alt_phone     VARCHAR(30),
  dob           DATE,
  gender        VARCHAR(20) DEFAULT 'Female',
  address       TEXT,
  city          VARCHAR(100),
  state         VARCHAR(100),
  pincode       VARCHAR(20),
  id_type       VARCHAR(50),
  id_number     VARCHAR(100),
  id_proof_url  VARCHAR(255),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Business Setups Table (Store Details for Household Businesses)
CREATE TABLE IF NOT EXISTS business_setups (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  user_id           INT NOT NULL UNIQUE,
  store_name        VARCHAR(150) NOT NULL,
  business_type     VARCHAR(100),
  category          VARCHAR(100),
  sub_category      VARCHAR(100),
  description       TEXT,
  years_in_business VARCHAR(50),
  num_employees     VARCHAR(50),
  gst_number        VARCHAR(50),
  store_address     TEXT,
  city              VARCHAR(100),
  state             VARCHAR(100),
  pincode           VARCHAR(20),
  store_logo_url    VARCHAR(255),
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Bank Setups Table (Bank Accounts for Cashfree Money Payouts)
CREATE TABLE IF NOT EXISTS bank_setups (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  user_id             INT NOT NULL UNIQUE,
  account_holder_name VARCHAR(150) NOT NULL,
  account_number      VARCHAR(100) NOT NULL,
  ifsc_code           VARCHAR(50) NOT NULL,
  bank_name           VARCHAR(100) NOT NULL,
  branch_name         VARCHAR(100),
  account_type        VARCHAR(50),
  is_confirmed        TINYINT(1) DEFAULT 1,
  cashfree_vendor_id  VARCHAR(100),
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Products Table (Homemade Products by Women Entrepreneurs)
CREATE TABLE IF NOT EXISTS products (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  seller_id   INT NOT NULL,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  price       DECIMAL(10, 2) NOT NULL,
  category    VARCHAR(100),
  image_url   VARCHAR(500),
  stock       INT DEFAULT 10,
  artisan_name VARCHAR(100),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Orders Table (Cashfree E-Commerce Orders)
CREATE TABLE IF NOT EXISTS orders (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  user_id         INT NOT NULL,
  cf_order_id     VARCHAR(100) NOT NULL UNIQUE,
  order_amount    DECIMAL(10, 2) NOT NULL,
  order_currency  VARCHAR(10) DEFAULT 'INR',
  order_status    VARCHAR(50) DEFAULT 'CREATED',
  customer_name   VARCHAR(100),
  customer_email  VARCHAR(255),
  customer_phone  VARCHAR(30),
  product_title   VARCHAR(255),
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. Payments Table (Cashfree Payment Transactions)
CREATE TABLE IF NOT EXISTS payments (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  order_id        VARCHAR(100) NOT NULL,
  cf_payment_id   VARCHAR(100),
  payment_status  VARCHAR(50) NOT NULL,
  payment_amount  DECIMAL(10, 2) NOT NULL,
  payment_method  VARCHAR(50),
  payment_time    VARCHAR(100),
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 9. NGO Profiles Table (NGO Basic Identity)
CREATE TABLE IF NOT EXISTS ngo_profiles (
  id                 INT AUTO_INCREMENT PRIMARY KEY,
  user_id            INT NOT NULL UNIQUE,
  ngo_name           VARCHAR(255) NOT NULL,
  registration_no    VARCHAR(100) NOT NULL,
  ngo_type           VARCHAR(100) NOT NULL,
  establishment_year VARCHAR(20) NOT NULL,
  logo_url           VARCHAR(255),
  created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. NGO Contacts Table (NGO Contact & Verification)
CREATE TABLE IF NOT EXISTS ngo_contacts (
  id                   INT AUTO_INCREMENT PRIMARY KEY,
  user_id              INT NOT NULL UNIQUE,
  official_email       VARCHAR(255) NOT NULL,
  phone                VARCHAR(30) NOT NULL,
  website              VARCHAR(255),
  registered_address   TEXT NOT NULL,
  operational_address  TEXT,
  contact_person_name  VARCHAR(150) NOT NULL,
  designation          VARCHAR(100) NOT NULL,
  contact_id_proof_url VARCHAR(255),
  created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 11. NGO Documents Table (NGO Legal / Compliance Docs)
CREATE TABLE IF NOT EXISTS ngo_documents (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  user_id           INT NOT NULL UNIQUE,
  reg_cert_url      VARCHAR(255) NOT NULL,
  pan_card_url      VARCHAR(255) NOT NULL,
  cert_80g_12a_url  VARCHAR(255),
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
