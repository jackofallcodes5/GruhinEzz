const { pool } = require("../config/db");

async function getCart(req, res) {
  try {
    const userId = req.user.id;
    const { rows } = await pool.query(
      `SELECT c.quantity, p.* 
       FROM cart_items c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = $1`,
      [userId]
    );
    res.json({ success: true, cartItems: rows });
  } catch (err) {
    console.error("getCart:", err);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
}

async function addToCart(req, res) {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    await pool.query(
      `INSERT INTO cart_items (user_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, product_id) 
       DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity, updated_at = NOW()`,
      [userId, productId, quantity]
    );
    res.json({ success: true, message: "Added to cart" });
  } catch (err) {
    console.error("addToCart:", err);
    res.status(500).json({ message: "Failed to add to cart" });
  }
}

async function updateCartItem(req, res) {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      await pool.query(`DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2`, [userId, productId]);
    } else {
      await pool.query(
        `UPDATE cart_items SET quantity = $1, updated_at = NOW() WHERE user_id = $2 AND product_id = $3`,
        [quantity, userId, productId]
      );
    }
    res.json({ success: true, message: "Cart updated" });
  } catch (err) {
    console.error("updateCartItem:", err);
    res.status(500).json({ message: "Failed to update cart item" });
  }
}

async function removeFromCart(req, res) {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    await pool.query(`DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2`, [userId, productId]);
    res.json({ success: true, message: "Removed from cart" });
  } catch (err) {
    console.error("removeFromCart:", err);
    res.status(500).json({ message: "Failed to remove from cart" });
  }
}

async function clearCart(req, res) {
  try {
    const userId = req.user.id;
    await pool.query(`DELETE FROM cart_items WHERE user_id = $1`, [userId]);
    res.json({ success: true, message: "Cart cleared" });
  } catch (err) {
    console.error("clearCart:", err);
    res.status(500).json({ message: "Failed to clear cart" });
  }
}

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
