require("dotenv").config();
const { pool } = require("./config/db");
const jwt = require("jsonwebtoken");

async function testApi() {
  try {
    // get a user
    const { rows: users } = await pool.query("SELECT * FROM users WHERE role = 'buyer' LIMIT 1");
    if (users.length === 0) return console.log("No buyer found");
    const user = users[0];

    // get a product
    const { rows: products } = await pool.query("SELECT * FROM products LIMIT 1");
    if (products.length === 0) return console.log("No products found");
    const product = products[0];

    console.log(`Testing with user ${user.id} and product ${product.id}`);

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || "gruhinezz_jwt_secret_key");

    const response = await fetch("http://localhost:5000/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ productId: product.id, quantity: 1 })
    });

    const data = await response.json();
    console.log("POST /api/cart response:", response.status, data);

  } catch (err) {
    console.error("Test Error:", err);
  } finally {
    pool.end();
  }
}
testApi();
