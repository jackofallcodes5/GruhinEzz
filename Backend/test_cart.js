require("dotenv").config();
const { pool } = require("./config/db");

async function checkCart() {
  try {
    const { rows } = await pool.query(`SELECT * FROM cart_items`);
    console.log("Cart Items in DB:", rows);
  } catch (err) {
    console.error("DB Error:", err.message);
  } finally {
    pool.end();
  }
}
checkCart();
