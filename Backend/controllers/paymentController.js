const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_dummy",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_secret",
});

async function createPaymentOrder(req, res) {
  try {
    const { amount } = req.body;
    if (!amount) {
      return res.status(400).json({ message: "Order amount is required." });
    }

    const options = {
      amount: Math.round(amount * 100), // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    
    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_dummy"
    });
  } catch (err) {
    console.error("createPaymentOrder error:", err);
    return res.status(500).json({ message: "Failed to create Razorpay payment order." });
  }
}

async function verifyPaymentStatus(req, res) {
  try {
    const { 
      razorpay_order_id, razorpay_payment_id, razorpay_signature,
      productId, sellerId, buyerId, amount, customerName, customerEmail, customerPhone,
      productTitle, productImageUrl, quantity
    } = req.body;
    
    const secret = process.env.RAZORPAY_KEY_SECRET || "dummy_secret";
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");
      
    if (expectedSignature === razorpay_signature) {
      
      if (buyerId && amount) {
        const { pool } = require("../config/db");
        await pool.query(
          `INSERT INTO orders 
            (user_id, seller_id, cf_order_id, order_amount, payment_status, payment_method, 
             customer_name, customer_email, customer_phone, product_title, product_image_url, quantity, unit_price, fulfillment_status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'Processing')
           ON CONFLICT (cf_order_id) DO NOTHING`,
           [buyerId, sellerId || 10, razorpay_payment_id, amount, 'PAID', 'Razorpay',
            customerName, customerEmail, customerPhone, productTitle, productImageUrl, quantity, amount]
        );
      }

      return res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (err) {
    console.error("verifyPaymentStatus error:", err);
    return res.status(500).json({ message: "Failed to verify Razorpay payment." });
  }
}

module.exports = {
  createPaymentOrder,
  verifyPaymentStatus,
};
