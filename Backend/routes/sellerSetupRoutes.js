const express = require("express");
const {
  saveProfile, getProfile,
  saveBusiness, getBusiness,
  saveBank, getBank,
} = require("../controllers/sellerSetupController");

const router = express.Router();

router.post("/info", saveProfile);
router.get("/info/:userId", getProfile);

router.post("/business", saveBusiness);
router.get("/business/:userId", getBusiness);

router.post("/bank", saveBank);
router.get("/bank/:userId", getBank);

module.exports = router;
