const { pool } = require("../config/db");

// Get all seller requests along with profile, business, and bank details
async function getAllSellers() {
  const { rows } = await pool.query(`
    SELECT
      u.id                AS user_id,
      u.user_name,
      u.email             AS user_email,
      u.contact_no,
      u.is_verified,
      u.created_at        AS registered_at,

      sp.full_name,
      sp.email            AS seller_email,
      sp.phone            AS seller_phone,
      sp.alt_phone,
      sp.dob,
      sp.gender,
      sp.address          AS seller_address,
      sp.city             AS seller_city,
      sp.state            AS seller_state,
      sp.pincode          AS seller_pincode,
      sp.id_type,
      sp.id_number,
      sp.id_proof_url,

      bs.store_name,
      bs.business_type,
      bs.category,
      bs.sub_category,
      bs.description,
      bs.years_in_business,
      bs.num_employees,
      bs.gst_number,
      bs.store_address,
      bs.city             AS store_city,
      bs.state            AS store_state,
      bs.pincode          AS store_pincode,
      bs.store_logo_url,

      bk.account_holder_name,
      bk.account_number,
      bk.ifsc_code,
      bk.bank_name,
      bk.branch_name,
      bk.account_type,
      bk.is_confirmed     AS bank_confirmed,
      bk.cashfree_vendor_id
    FROM users u
    LEFT JOIN seller_profiles sp ON u.id = sp.user_id
    LEFT JOIN business_setups  bs ON u.id = bs.user_id
    LEFT JOIN bank_setups      bk ON u.id = bk.user_id
    WHERE u.role = 'seller'
    ORDER BY u.created_at DESC
  `);
  return rows;
}

// Get all NGO requests along with identity, contact, and legal details
async function getAllNgos() {
  const { rows } = await pool.query(`
    SELECT
      u.id                AS user_id,
      u.user_name,
      u.email             AS user_email,
      u.contact_no,
      u.is_verified,
      u.created_at        AS registered_at,

      np.ngo_name,
      np.registration_no,
      np.ngo_type,
      np.establishment_year,
      np.logo_url,

      nc.official_email,
      nc.phone            AS ngo_phone,
      nc.website,
      nc.registered_address,
      nc.operational_address,
      nc.contact_person_name,
      nc.designation,
      nc.contact_id_proof_url,

      nd.reg_cert_url,
      nd.pan_card_url,
      nd.cert_80g_12a_url
    FROM users u
    LEFT JOIN ngo_profiles   np ON u.id = np.user_id
    LEFT JOIN ngo_contacts   nc ON u.id = nc.user_id
    LEFT JOIN ngo_documents  nd ON u.id = nd.user_id
    WHERE u.role = 'ngo'
    ORDER BY u.created_at DESC
  `);
  return rows;
}

// Update verification status in users table
async function updateVerificationStatus(userId, isVerified) {
  const { rows } = await pool.query(
    "UPDATE users SET is_verified = $1, updated_at = NOW() WHERE id = $2 RETURNING id",
    [isVerified, userId]
  );
  return rows[0];
}

module.exports = {
  getAllSellers,
  getAllNgos,
  updateVerificationStatus,
};
