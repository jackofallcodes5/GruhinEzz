const programModel = require("../models/empowermentProgramModel");

// --- NGO Endpoints ---

async function createProgram(req, res) {
  try {
    const ngoId = req.user.id;
    if (req.user.role !== 'ngo') {
      return res.status(403).json({ message: "Only NGOs can create programs." });
    }

    const programData = req.body;
    if (!programData.title || !programData.category) {
      return res.status(400).json({ message: "Title and Category are required." });
    }

    const program = await programModel.createProgram(ngoId, programData);
    res.status(201).json({ success: true, program });
  } catch (err) {
    console.error("createProgram Error:", err);
    res.status(500).json({ message: "Failed to create program." });
  }
}

async function getMyPrograms(req, res) {
  try {
    const ngoId = req.user.id;
    const programs = await programModel.getProgramsByNgo(ngoId);
    res.json({ success: true, programs });
  } catch (err) {
    console.error("getMyPrograms Error:", err);
    res.status(500).json({ message: "Failed to fetch programs." });
  }
}

async function publishProgram(req, res) {
  try {
    const ngoId = req.user.id;
    const { id } = req.params;
    
    // Additional validation could be added here before publishing
    const program = await programModel.publishProgram(id, ngoId);
    
    if (!program) {
      return res.status(404).json({ message: "Program not found or you don't have permission." });
    }
    
    res.json({ success: true, program });
  } catch (err) {
    console.error("publishProgram Error:", err);
    res.status(500).json({ message: "Failed to publish program." });
  }
}

async function getEventRegistrations(req, res) {
  try {
    const ngoId = req.user.id;
    const { id: programId } = req.params;
    const registrations = await programModel.getProgramRegistrationsForNgo(programId, ngoId);
    res.json({ success: true, registrations });
  } catch (err) {
    console.error("getEventRegistrations Error:", err);
    res.status(500).json({ message: "Failed to fetch registrations." });
  }
}

async function getDashboardStats(req, res) {
  try {
    const ngoId = req.user.id;
    const stats = await programModel.getNgoStats(ngoId);
    res.json({ success: true, stats });
  } catch (err) {
    console.error("getDashboardStats Error:", err);
    res.status(500).json({ message: "Failed to fetch stats." });
  }
}

// --- Seller Endpoints ---

async function getDiscoverablePrograms(req, res) {
  try {
    const programs = await programModel.getDiscoverablePrograms();
    res.json({ success: true, programs });
  } catch (err) {
    console.error("getDiscoverablePrograms Error:", err);
    res.status(500).json({ message: "Failed to load discoverable programs." });
  }
}

async function registerForProgram(req, res) {
  try {
    const sellerId = req.user.id;
    const { id: programId } = req.params;
    const { application_answers } = req.body;

    const registration = await programModel.registerForProgram(sellerId, programId, application_answers);
    res.status(201).json({ success: true, registration, message: "Successfully applied for the program!" });
  } catch (err) {
    console.error("registerForProgram Error:", err);
    if (err.code === '23505') { // Postgres unique violation error code
      return res.status(400).json({ message: "You have already applied for this program." });
    }
    res.status(500).json({ message: "Failed to register for program." });
  }
}

async function getMyRegistrations(req, res) {
  try {
    const sellerId = req.user.id;
    const registrations = await programModel.getSellerRegistrations(sellerId);
    res.json({ success: true, registrations });
  } catch (err) {
    console.error("getMyRegistrations Error:", err);
    res.status(500).json({ message: "Failed to fetch registrations." });
  }
}

module.exports = {
  createProgram,
  getMyPrograms,
  publishProgram,
  getEventRegistrations,
  getDashboardStats,
  getDiscoverablePrograms,
  registerForProgram,
  getMyRegistrations
};
