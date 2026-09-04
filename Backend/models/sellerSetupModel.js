const { pool } = require("../config/db");

// 1. Seller Profile (Personal / Identity Details)
async function saveSellerProfile(userId, data) {
  const {
    fullName, email, phone, altPhone, dob, gender,
    address, city, state, pincode, idType, idNumber, idProofUrl,
  } = data;

  const { rows } = await pool.query(
    `INSERT INTO seller_profiles
      (user_id, full_name, email, phone, alt_phone, dob, gender, address, city, state, pincode, id_type, id_number, id_proof_url)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
     ON CONFLICT (user_id) DO UPDATE SET
       full_name    = EXCLUDED.full_name,
       email        = EXCLUDED.email,
       phone        = EXCLUDED.phone,
       alt_phone    = EXCLUDED.alt_phone,
       dob          = EXCLUDED.dob,
       gender       = EXCLUDED.gender,
       address      = EXCLUDED.address,
       city         = EXCLUDED.city,
       state        = EXCLUDED.state,
       pincode      = EXCLUDED.pincode,
       id_type      = EXCLUDED.id_type,
       id_number    = EXCLUDED.id_number,
       id_proof_url = EXCLUDED.id_proof_url,
       updated_at   = NOW()
     RETURNING *`,
    [
      userId, fullName, email, phone, altPhone || null,
      dob || null, gender || "Female", address, city, state, pincode,
      idType, idNumber, idProofUrl || null,
    ]
  );
  return rows[0];
}

async function getSellerProfile(userId) {
  const { rows } = await pool.query(
    "SELECT * FROM seller_profiles WHERE user_id = $1 LIMIT 1",
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

  const { rows } = await pool.query(
    `INSERT INTO business_setups
      (user_id, store_name, business_type, category, sub_category, description, years_in_business, num_employees, gst_number, store_address, city, state, pincode, store_logo_url)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
     ON CONFLICT (user_id) DO UPDATE SET
       store_name        = EXCLUDED.store_name,
       business_type     = EXCLUDED.business_type,
       category          = EXCLUDED.category,
       sub_category      = EXCLUDED.sub_category,
       description       = EXCLUDED.description,
       years_in_business = EXCLUDED.years_in_business,
       num_employees     = EXCLUDED.num_employees,
       gst_number        = EXCLUDED.gst_number,
       store_address     = EXCLUDED.store_address,
       city              = EXCLUDED.city,
       state             = EXCLUDED.state,
       pincode           = EXCLUDED.pincode,
       store_logo_url    = EXCLUDED.store_logo_url,
       updated_at        = NOW()
     RETURNING *`,
    [
      userId, storeName, businessType, category, subCategory, description,
      yearsInBusiness, numEmployees, gstNumber || null, storeAddress, city, state, pincode, storeLogoUrl || null,
    ]
  );
  return rows[0];
}

async function getBusinessSetup(userId) {
  const { rows } = await pool.query(
    "SELECT * FROM business_setups WHERE user_id = $1 LIMIT 1",
    [userId]
  );
  return rows[0] || null;
}

// 3. Bank Setup (Bank Account for Cashfree Payouts)
async function saveBankSetup(userId, data) {
  const {
    accountHolderName, accountNumber, ifscCode, bankName, branchName, accountType, isConfirmed, cashfreeVendorId,
  } = data;

  const { rows } = await pool.query(
    `INSERT INTO bank_setups
      (user_id, account_holder_name, account_number, ifsc_code, bank_name, branch_name, account_type, is_confirmed, cashfree_vendor_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     ON CONFLICT (user_id) DO UPDATE SET
       account_holder_name = EXCLUDED.account_holder_name,
       account_number      = EXCLUDED.account_number,
       ifsc_code           = EXCLUDED.ifsc_code,
       bank_name           = EXCLUDED.bank_name,
       branch_name         = EXCLUDED.branch_name,
       account_type        = EXCLUDED.account_type,
       is_confirmed        = EXCLUDED.is_confirmed,
       cashfree_vendor_id  = EXCLUDED.cashfree_vendor_id,
       updated_at          = NOW()
     RETURNING *`,
    [
      userId, accountHolderName, accountNumber, ifscCode, bankName, branchName, accountType,
      isConfirmed !== false, cashfreeVendorId || `vendor_${userId}_${Date.now()}`,
    ]
  );
  return rows[0];
}

async function getBankSetup(userId) {
  const { rows } = await pool.query(
    "SELECT * FROM bank_setups WHERE user_id = $1 LIMIT 1",
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
