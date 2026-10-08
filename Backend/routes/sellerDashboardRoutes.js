const express = require("express");
const {
  getProducts, saveProduct, removeProduct,
  getOrders, updateOrderStatus,
  getEarnings, withdraw,
  getSettings, saveSettings,
} = require("../controllers/sellerDashboardController");

const router = express.Router();

// Products
router.get("/products",                 getProducts);
router.post("/products",                saveProduct);
router.delete("/products/:productId",   removeProduct);

// Orders
router.get("/orders",                   getOrders);
router.patch("/orders/status",          updateOrderStatus);

// Earnings & Transactions
router.get("/earnings",                 getEarnings);
router.post("/earnings/withdraw",       withdraw);

// Settings (shipping rules + notifications)
router.get("/settings",                 getSettings);
router.post("/settings",                saveSettings);

module.exports = router;
