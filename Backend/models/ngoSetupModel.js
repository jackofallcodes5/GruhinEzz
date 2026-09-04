const { pool } = require("../config/db");

// 1. Basic Identity
async function saveNgoIdentity(userId, data) {
  const { ngoName, registrationNo, ngoType, establishmentYear, logoUrl } = data;

  const { rows } = await pool.query(
    `INSERT INTO ngo_profiles
      (user_id, ngo_name, registration_no, ngo_type, establishment_year, logo_url)
     VALUES ($1,$2,$3,$4,$5,$6)
     ON CONFLICT (user_id) DO UPDATE SET
       ngo_name           = EXCLUDED.ngo_name,
       registration_no    = EXCLUDED.registration_no,
       ngo_type           = EXCLUDED.ngo_type,
       establishment_year = EXCLUDED.establishment_year,
       logo_url           = EXCLUDED.logo_url,
       updated_at         = NOW()
     RETURNING *`,
    [userId, ngoName, registrationNo, ngoType, establishmentYear, logoUrl || null]
  );
  return rows[0];
}

async function getNgoIdentity(userId) {
  const { rows } = await pool.query(
    "SELECT * FROM ngo_profiles WHERE user_id = $1 LIMIT 1",
    [userId]
  );
  return rows[0] || null;
}

// 2. Contact & Verification
async function saveNgoContact(userId, data) {
  const {
    officialEmail, phone, website, registeredAddress,
    operationalAddress, contactPersonName, designation, contactIdProofUrl,
  } = data;

  const { rows } = await pool.query(
    `INSERT INTO ngo_contacts
      (user_id, official_email, phone, website, registered_address, operational_address, contact_person_name, designation, contact_id_proof_url)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     ON CONFLICT (user_id) DO UPDATE SET
       official_email       = EXCLUDED.official_email,
       phone                = EXCLUDED.phone,
       website              = EXCLUDED.website,
       registered_address   = EXCLUDED.registered_address,
       operational_address  = EXCLUDED.operational_address,
       contact_person_name  = EXCLUDED.contact_person_name,
       designation          = EXCLUDED.designation,
       contact_id_proof_url = EXCLUDED.contact_id_proof_url,
       updated_at           = NOW()
     RETURNING *`,
    [
      userId, officialEmail, phone, website || null, registeredAddress,
      operationalAddress || null, contactPersonName, designation, contactIdProofUrl || null,
    ]
  );
  return rows[0];
}

async function getNgoContact(userId) {
  const { rows } = await pool.query(
    "SELECT * FROM ngo_contacts WHERE user_id = $1 LIMIT 1",
    [userId]
  );
  return rows[0] || null;
}

// 3. Legal & Compliance Docs
async function saveNgoLegal(userId, data) {
  const { regCertUrl, panCardUrl, cert80g12aUrl } = data;

  const { rows } = await pool.query(
    `INSERT INTO ngo_documents
      (user_id, reg_cert_url, pan_card_url, cert_80g_12a_url)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (user_id) DO UPDATE SET
       reg_cert_url     = EXCLUDED.reg_cert_url,
       pan_card_url     = EXCLUDED.pan_card_url,
       cert_80g_12a_url = EXCLUDED.cert_80g_12a_url,
       updated_at       = NOW()
     RETURNING *`,
    [userId, regCertUrl, panCardUrl, cert80g12aUrl || null]
  );
  return rows[0];
}

async function getNgoLegal(userId) {
  const { rows } = await pool.query(
    "SELECT * FROM ngo_documents WHERE user_id = $1 LIMIT 1",
    [userId]
  );
  return rows[0] || null;
}

module.exports = {
  saveNgoIdentity,
  getNgoIdentity,
  saveNgoContact,
  getNgoContact,
  saveNgoLegal,
  getNgoLegal,
};
