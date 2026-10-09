const { pool } = require("../config/db");

// NGO specific actions
async function createProgram(ngoId, programData) {
  const {
    title, category, summary, description, learning_objectives, skills_covered,
    cover_image_url, delivery_mode, venue_details, online_access_details,
    start_at, end_at, registration_opens_at, registration_deadline,
    capacity, approval_mode, waitlist_enabled, visibility, eligibility_rules
  } = programData;

  const result = await pool.query(
    `INSERT INTO empowerment_programs (
      ngo_id, title, category, summary, description, learning_objectives, skills_covered,
      cover_image_url, delivery_mode, venue_details, online_access_details,
      start_at, end_at, registration_opens_at, registration_deadline,
      capacity, approval_mode, waitlist_enabled, visibility, eligibility_rules, status
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, 'Draft'
    ) RETURNING *`,
    [
      ngoId, title, category, summary, description, learning_objectives, skills_covered,
      cover_image_url, delivery_mode, venue_details, online_access_details,
      start_at || null, end_at || null, registration_opens_at || null, registration_deadline || null,
      capacity || null, approval_mode || 'Automatic', waitlist_enabled || false, visibility || 'All Eligible Sellers',
      eligibility_rules ? JSON.stringify(eligibility_rules) : null
    ]
  );
  return result.rows[0];
}

async function getProgramsByNgo(ngoId) {
  const result = await pool.query(
    `SELECT * FROM empowerment_programs WHERE ngo_id = $1 ORDER BY created_at DESC`,
    [ngoId]
  );
  return result.rows;
}

async function getProgramRegistrationsForNgo(programId, ngoId) {
  const result = await pool.query(
    `SELECT pr.*, u.user_name as seller_name, u.email as seller_email
     FROM program_registrations pr
     JOIN empowerment_programs ep ON pr.program_id = ep.id
     JOIN users u ON pr.seller_id = u.id
     WHERE ep.id = $1 AND ep.ngo_id = $2
     ORDER BY pr.applied_at DESC`,
    [programId, ngoId]
  );
  return result.rows;
}

async function publishProgram(programId, ngoId) {
  const result = await pool.query(
    `UPDATE empowerment_programs 
     SET status = 'Published', published_at = NOW(), updated_at = NOW()
     WHERE id = $1 AND ngo_id = $2 
     RETURNING *`,
    [programId, ngoId]
  );
  return result.rows[0];
}

async function getNgoStats(ngoId) {
  const eventCountRes = await pool.query(
    `SELECT COUNT(*) as count FROM empowerment_programs WHERE ngo_id = $1`,
    [ngoId]
  );
  
  const beneficiaryCountRes = await pool.query(
    `SELECT COUNT(*) as count FROM ngo_beneficiaries WHERE ngo_id = $1`,
    [ngoId]
  );
  
  return {
    eventsHosted: parseInt(eventCountRes.rows[0].count, 10),
    beneficiariesEnrolled: parseInt(beneficiaryCountRes.rows[0].count, 10),
    impactScore: 94.5 // Placeholder until calculated based on activity
  };
}

// Seller specific actions
async function getDiscoverablePrograms() {
  // Fetch programs that are published and visible to all eligible sellers
  const result = await pool.query(
    `SELECT ep.*, u.user_name as ngo_name
     FROM empowerment_programs ep
     JOIN users u ON ep.ngo_id = u.id
     WHERE ep.status = 'Published' 
       AND (ep.visibility = 'All Eligible Sellers' OR ep.visibility = 'Public')
     ORDER BY ep.published_at DESC`
  );
  return result.rows;
}

async function registerForProgram(sellerId, programId, answers = null) {
  // Enforce capacity and constraints (assuming simple insert for now)
  const result = await pool.query(
    `INSERT INTO program_registrations (program_id, seller_id, application_answers, status)
     VALUES ($1, $2, $3, 'Applied')
     RETURNING *`,
    [programId, sellerId, answers ? JSON.stringify(answers) : null]
  );
  return result.rows[0];
}

async function getSellerRegistrations(sellerId) {
  const result = await pool.query(
    `SELECT pr.*, ep.title, ep.category, ep.start_at, ep.delivery_mode, u.user_name as ngo_name
     FROM program_registrations pr
     JOIN empowerment_programs ep ON pr.program_id = ep.id
     JOIN users u ON ep.ngo_id = u.id
     WHERE pr.seller_id = $1
     ORDER BY pr.applied_at DESC`,
    [sellerId]
  );
  return result.rows;
}

module.exports = {
  createProgram,
  getProgramsByNgo,
  publishProgram,
  getDiscoverablePrograms,
  registerForProgram,
  getSellerRegistrations,
  getProgramRegistrationsForNgo,
  getNgoStats
};
