const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.post("/login", adminController.adminLogin);
router.get("/sellers", adminController.getSellers);
router.get("/ngos", adminController.getNgos);
router.post("/verify-user", adminController.verifyUser);

module.exports = router;
