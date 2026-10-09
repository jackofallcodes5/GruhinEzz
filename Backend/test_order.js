require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');

async function test() {
  const secret = process.env.RAZORPAY_KEY_SECRET || "dummy_secret";
  const orderId = "order_12345";
  const paymentId = "pay_" + Date.now();
  
  const signature = crypto
      .createHmac("sha256", secret)
      .update(orderId + "|" + paymentId)
      .digest("hex");

  try {
    const res = await axios.post('http://localhost:5000/api/payment/verify', {
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
      productId: 1,
      sellerId: 10,
      buyerId: 8, // Using an existing user id maybe? Let's use 10 for both just to test.
      amount: 499,
      customerName: "Test Buyer",
      customerEmail: "test@example.com",
      customerPhone: "9999999999",
      productTitle: "Test Craft",
      productImageUrl: "http://image.com/1.jpg",
      quantity: 1
    });
    console.log("Success:", res.data);
  } catch(e) {
    console.log("Error:", e.response ? e.response.data : e.message);
  }
}
test();
