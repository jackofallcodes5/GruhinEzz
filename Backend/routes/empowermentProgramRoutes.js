const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const programController = require("../controllers/empowermentProgramController");

// Basic auth requirement for all these routes
router.use(requireAuth);

// NGO Routes
router.get("/ngo/stats", requireRole("ngo"), programController.getDashboardStats);
router.post("/ngo", requireRole("ngo"), programController.createProgram);
router.get("/ngo/mine", requireRole("ngo"), programController.getMyPrograms);
router.post("/ngo/:id/publish", requireRole("ngo"), programController.publishProgram);
router.get("/ngo/:id/registrations", requireRole("ngo"), programController.getEventRegistrations);

// Seller Routes
router.get("/seller/discover", requireRole("seller"), programController.getDiscoverablePrograms);
router.post("/seller/:id/register", requireRole("seller"), programController.registerForProgram);
router.get("/seller/registrations", requireRole("seller"), programController.getMyRegistrations);

module.exports = router;
