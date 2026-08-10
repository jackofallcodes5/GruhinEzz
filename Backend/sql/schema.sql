-- Run this once against your MySQL server:
--   mysql -u root -p < sql/schema.sql

CREATE DATABASE IF NOT EXISTS gruhinezz
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE gruhinezz;

CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  role          ENUM('buyer', 'seller', 'ngo') NOT NULL,
  user_name     VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  contact_no    VARCHAR(20)  NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
