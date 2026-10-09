const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.post("/login", adminController.adminLogin);
router.get("/sellers", adminController.getSellers);
router.get("/ngos", adminController.getNgos);
router.get("/products", adminController.getProducts);
router.get("/programs", adminController.getPrograms);
router.get("/users", adminController.getUsers);
router.get("/overview", adminController.getOverviewStats);
router.post("/verify-user", adminController.verifyUser);

module.exports = router;

