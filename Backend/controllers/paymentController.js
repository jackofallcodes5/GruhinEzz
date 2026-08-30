const cashfreeService = require("../services/cashfreeService");

async function createPaymentOrder(req, res) {
  try {
    const { userId, amount, customerName, customerEmail, customerPhone, productTitle } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Order amount is required." });
    }

    const result = await cashfreeService.createOrder({
      userId,
      amount,
      customerName: customerName || "Buyer",
      customerEmail: customerEmail || "buyer@gruhinezz.com",
      customerPhone: customerPhone || "9876543210",
      productTitle: productTitle || "Handmade Product",
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error("createPaymentOrder error:", err);
    return res.status(500).json({ message: "Failed to create Cashfree payment order." });
  }
}

async function verifyPaymentStatus(req, res) {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required." });
    }

    const result = await cashfreeService.verifyPayment(orderId);
    return res.status(200).json(result);
  } catch (err) {
    console.error("verifyPaymentStatus error:", err);
    return res.status(500).json({ message: "Failed to verify Cashfree payment." });
  }
}

module.exports = {
  createPaymentOrder,
  verifyPaymentStatus,
};
