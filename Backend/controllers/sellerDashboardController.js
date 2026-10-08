const m = require("../models/sellerDashboardModel");

// Resolve sellerId from query param, body, or JWT (fallback: 10 for demo)
function getSellerId(req) {
  return (
    req.user?.id ||
    parseInt(req.query.sellerId || req.body.sellerId || "10", 10)
  );
}

// ─── Products ──────────────────────────────────────────────────────────────────
async function getProducts(req, res) {
  try {
    const products = await m.getProductsBySeller(getSellerId(req));
    res.json({ products });
  } catch (err) {
    console.error("getProducts:", err);
    res.status(500).json({ message: "Failed to fetch products." });
  }
}

async function saveProduct(req, res) {
  try {
    const product = await m.upsertProduct(getSellerId(req), req.body);
    res.json({ product, message: "Product saved." });
  } catch (err) {
    console.error("saveProduct:", err);
    res.status(500).json({ message: "Failed to save product." });
  }
}

async function removeProduct(req, res) {
  try {
    const ok = await m.deleteProduct(getSellerId(req), req.params.productId);
    if (!ok) return res.status(404).json({ message: "Product not found." });
    res.json({ message: "Product deleted." });
  } catch (err) {
    console.error("removeProduct:", err);
    res.status(500).json({ message: "Failed to delete product." });
  }
}

// ─── Orders ────────────────────────────────────────────────────────────────────
async function getOrders(req, res) {
  try {
    const orders = await m.getOrdersBySeller(getSellerId(req));
    res.json({ orders });
  } catch (err) {
    console.error("getOrders:", err);
    res.status(500).json({ message: "Failed to fetch orders." });
  }
}

async function updateOrderStatus(req, res) {
  try {
    const { cfOrderId, fulfillmentStatus } = req.body;
    const order = await m.updateOrderFulfillment(getSellerId(req), cfOrderId, fulfillmentStatus);
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.json({ order, message: `Order marked as ${fulfillmentStatus}.` });
  } catch (err) {
    console.error("updateOrderStatus:", err);
    res.status(500).json({ message: "Failed to update order." });
  }
}

// ─── Earnings ──────────────────────────────────────────────────────────────────
async function getEarnings(req, res) {
  try {
    const sellerId = getSellerId(req);
    const [earnings, transactions] = await Promise.all([
      m.getEarnings(sellerId),
      m.getTransactions(sellerId),
    ]);
    res.json({ earnings, transactions });
  } catch (err) {
    console.error("getEarnings:", err);
    res.status(500).json({ message: "Failed to fetch earnings." });
  }
}

async function withdraw(req, res) {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0)
      return res.status(400).json({ message: "Invalid withdrawal amount." });
    const result = await m.processWithdrawal(getSellerId(req), parseFloat(amount));
    res.json({ ...result, message: `₹${amount} transferred to your bank account.` });
  } catch (err) {
    console.error("withdraw:", err);
    const msg = err.message === "Insufficient balance"
      ? "Insufficient balance for withdrawal."
      : "Failed to process withdrawal.";
    res.status(400).json({ message: msg });
  }
}

// ─── Settings ──────────────────────────────────────────────────────────────────
async function getSettings(req, res) {
  try {
    const settings = await m.getSettings(getSellerId(req));
    res.json({ settings });
  } catch (err) {
    console.error("getSettings:", err);
    res.status(500).json({ message: "Failed to fetch settings." });
  }
}

async function saveSettings(req, res) {
  try {
    const settings = await m.saveSettings(getSellerId(req), req.body);
    res.json({ settings, message: "Settings saved." });
  } catch (err) {
    console.error("saveSettings:", err);
    res.status(500).json({ message: "Failed to save settings." });
  }
}

module.exports = {
  getProducts, saveProduct, removeProduct,
  getOrders, updateOrderStatus,
  getEarnings, withdraw,
  getSettings, saveSettings,
};
