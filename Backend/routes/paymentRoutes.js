const express = require("express");
const { createPaymentOrder, verifyPaymentStatus } = require("../controllers/paymentController");

const router = express.Router();

router.post("/create-order", createPaymentOrder);
router.post("/verify", verifyPaymentStatus);

module.exports = router;
