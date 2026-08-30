const { pool } = require("../config/db");

// 1. Seller Profile (Personal / Identity Details)
async function saveSellerProfile(userId, data) {
  const {
    fullName, email, phone, altPhone, dob, gender,
    address, city, state, pincode, idType, idNumber, idProofUrl,
  } = data;

  const [result] = await pool.query(
    `INSERT INTO seller_profiles
      (user_id, full_name, email, phone, alt_phone, dob, gender, address, city, state, pincode, id_type, id_number, id_proof_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
      full_name = VALUES(full_name),
      email = VALUES(email),
      phone = VALUES(phone),
      alt_phone = VALUES(alt_phone),
      dob = VALUES(dob),
      gender = VALUES(gender),
      address = VALUES(address),
      city = VALUES(city),
      state = VALUES(state),
      pincode = VALUES(pincode),
      id_type = VALUES(id_type),
      id_number = VALUES(id_number),
      id_proof_url = VALUES(id_proof_url)`,
    [
      userId, fullName, email, phone, altPhone || null,
      dob || null, gender || "Female", address, city, state, pincode,
      idType, idNumber, idProofUrl || null,
    ]
  );
  return result;
}

async function getSellerProfile(userId) {
  const [rows] = await pool.query(
    `SELECT * FROM seller_profiles WHERE user_id = ? LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

// 2. Business Setup (Store Details)
async function saveBusinessSetup(userId, data) {
  const {
    storeName, businessType, category, subCategory, description,
    yearsInBusiness, numEmployees, gstNumber, storeAddress, city, state, pincode, storeLogoUrl,
  } = data;

  const [result] = await pool.query(
    `INSERT INTO business_setups
      (user_id, store_name, business_type, category, sub_category, description, years_in_business, num_employees, gst_number, store_address, city, state, pincode, store_logo_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
      store_name = VALUES(store_name),
      business_type = VALUES(business_type),
      category = VALUES(category),
      sub_category = VALUES(sub_category),
      description = VALUES(description),
      years_in_business = VALUES(years_in_business),
      num_employees = VALUES(num_employees),
      gst_number = VALUES(gst_number),
      store_address = VALUES(store_address),
      city = VALUES(city),
      state = VALUES(state),
      pincode = VALUES(pincode),
      store_logo_url = VALUES(store_logo_url)`,
    [
      userId, storeName, businessType, category, subCategory, description,
      yearsInBusiness, numEmployees, gstNumber || null, storeAddress, city, state, pincode, storeLogoUrl || null,
    ]
  );
  return result;
}

async function getBusinessSetup(userId) {
  const [rows] = await pool.query(
    `SELECT * FROM business_setups WHERE user_id = ? LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

// 3. Bank Setup (Bank Account for Cashfree Payouts)
async function saveBankSetup(userId, data) {
  const {
    accountHolderName, accountNumber, ifscCode, bankName, branchName, accountType, isConfirmed, cashfreeVendorId,
  } = data;

  const [result] = await pool.query(
    `INSERT INTO bank_setups
      (user_id, account_holder_name, account_number, ifsc_code, bank_name, branch_name, account_type, is_confirmed, cashfree_vendor_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
      account_holder_name = VALUES(account_holder_name),
      account_number = VALUES(account_number),
      ifsc_code = VALUES(ifsc_code),
      bank_name = VALUES(bank_name),
      branch_name = VALUES(branch_name),
      account_type = VALUES(account_type),
      is_confirmed = VALUES(is_confirmed),
      cashfree_vendor_id = VALUES(cashfree_vendor_id)`,
    [
      userId, accountHolderName, accountNumber, ifscCode, bankName, branchName, accountType,
      isConfirmed ? 1 : 0, cashfreeVendorId || `vendor_${userId}_${Date.now()}`,
    ]
  );
  return result;
}

async function getBankSetup(userId) {
  const [rows] = await pool.query(
    `SELECT * FROM bank_setups WHERE user_id = ? LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

module.exports = {
  saveSellerProfile,
  getSellerProfile,
  saveBusinessSetup,
  getBusinessSetup,
  saveBankSetup,
  getBankSetup,
};
