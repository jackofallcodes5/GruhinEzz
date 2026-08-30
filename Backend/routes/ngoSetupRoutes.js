const express = require("express");
const router = express.Router();
const ngoSetupController = require("../controllers/ngoSetupController");

router.post("/identity", ngoSetupController.saveIdentity);
router.get("/identity/:userId", ngoSetupController.getIdentity);

router.post("/contact", ngoSetupController.saveContact);
router.get("/contact/:userId", ngoSetupController.getContact);

router.post("/legal", ngoSetupController.saveLegal);
router.get("/legal/:userId", ngoSetupController.getLegal);

module.exports = router;
