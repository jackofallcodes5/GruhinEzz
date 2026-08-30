const { pool } = require("../config/db");

// 1. Basic Identity
async function saveNgoIdentity(userId, data) {
  const { ngoName, registrationNo, ngoType, establishmentYear, logoUrl } = data;

  const [result] = await pool.query(
    `INSERT INTO ngo_profiles
      (user_id, ngo_name, registration_no, ngo_type, establishment_year, logo_url)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
      ngo_name = VALUES(ngo_name),
      registration_no = VALUES(registration_no),
      ngo_type = VALUES(ngo_type),
      establishment_year = VALUES(establishment_year),
      logo_url = VALUES(logo_url)`,
    [userId, ngoName, registrationNo, ngoType, establishmentYear, logoUrl || null]
  );
  return result;
}

async function getNgoIdentity(userId) {
  const [rows] = await pool.query(
    `SELECT * FROM ngo_profiles WHERE user_id = ? LIMIT 1`,
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

  const [result] = await pool.query(
    `INSERT INTO ngo_contacts
      (user_id, official_email, phone, website, registered_address, operational_address, contact_person_name, designation, contact_id_proof_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
      official_email = VALUES(official_email),
      phone = VALUES(phone),
      website = VALUES(website),
      registered_address = VALUES(registered_address),
      operational_address = VALUES(operational_address),
      contact_person_name = VALUES(contact_person_name),
      designation = VALUES(designation),
      contact_id_proof_url = VALUES(contact_id_proof_url)`,
    [
      userId, officialEmail, phone, website || null, registeredAddress,
      operationalAddress || null, contactPersonName, designation, contactIdProofUrl || null,
    ]
  );
  return result;
}

async function getNgoContact(userId) {
  const [rows] = await pool.query(
    `SELECT * FROM ngo_contacts WHERE user_id = ? LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

// 3. Legal & Compliance Docs
async function saveNgoLegal(userId, data) {
  const { regCertUrl, panCardUrl, cert80g12aUrl } = data;

  const [result] = await pool.query(
    `INSERT INTO ngo_documents
      (user_id, reg_cert_url, pan_card_url, cert_80g_12a_url)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
      reg_cert_url = VALUES(reg_cert_url),
      pan_card_url = VALUES(pan_card_url),
      cert_80g_12a_url = VALUES(cert_80g_12a_url)`,
    [userId, regCertUrl, panCardUrl, cert80g12aUrl || null]
  );
  return result;
}

async function getNgoLegal(userId) {
  const [rows] = await pool.query(
    `SELECT * FROM ngo_documents WHERE user_id = ? LIMIT 1`,
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
