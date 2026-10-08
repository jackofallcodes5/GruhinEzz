const { pool } = require("../config/db");

// ─── Products ─────────────────────────────────────────────────────────────────

async function getProductsBySeller(sellerId) {
  const { rows } = await pool.query(
    `SELECT id, title, description, price, original_price, discount_pct,
            category, image_url, images, stock, artisan_name,
            rating, review_count, is_active, created_at
     FROM products
     WHERE seller_id = $1
     ORDER BY created_at DESC`,
    [sellerId]
  );
  return rows;
}

async function upsertProduct(sellerId, data) {
  const {
    id, title, description, price, originalPrice, discountPct,
    category, imageUrl, stock, artisanName, isActive,
  } = data;

  if (id) {
    const { rows } = await pool.query(
      `UPDATE products SET
         title          = $1,
         description    = $2,
         price          = $3,
         original_price = $4,
         discount_pct   = $5,
         category       = $6,
         image_url      = $7,
         stock          = $8,
         artisan_name   = $9,
         is_active      = $10,
         updated_at     = NOW()
       WHERE id = $11 AND seller_id = $12
       RETURNING *`,
      [title, description, price, originalPrice || null, discountPct || 0,
       category, imageUrl || null, stock || 10, artisanName || null,
       isActive !== false, id, sellerId]
    );
    return rows[0];
  } else {
    const { rows } = await pool.query(
      `INSERT INTO products
         (seller_id, title, description, price, original_price, discount_pct,
          category, image_url, stock, artisan_name, is_active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [sellerId, title, description, price, originalPrice || null, discountPct || 0,
       category, imageUrl || null, stock || 10, artisanName || null, isActive !== false]
    );
    return rows[0];
  }
}

async function deleteProduct(sellerId, productId) {
  const { rowCount } = await pool.query(
    `DELETE FROM products WHERE id = $1 AND seller_id = $2`,
    [productId, sellerId]
  );
  return rowCount > 0;
}

// ─── Orders ───────────────────────────────────────────────────────────────────

async function getOrdersBySeller(sellerId) {
  const { rows } = await pool.query(
    `SELECT id, cf_order_id, order_amount, payment_status, payment_method,
            fulfillment_status, tracking_number,
            customer_name, customer_email, customer_phone,
            shipping_address, shipping_city, shipping_state, shipping_pincode,
            product_title, product_image_url, product_variant,
            quantity, unit_price, created_at
     FROM orders
     WHERE seller_id = $1
     ORDER BY created_at DESC`,
    [sellerId]
  );
  return rows;
}

async function updateOrderFulfillment(sellerId, cfOrderId, fulfillmentStatus) {
  const { rows } = await pool.query(
    `UPDATE orders
     SET fulfillment_status = $1
     WHERE cf_order_id = $2 AND seller_id = $3
     RETURNING *`,
    [fulfillmentStatus, cfOrderId, sellerId]
  );
  return rows[0];
}

// ─── Earnings & Transactions ──────────────────────────────────────────────────

async function getEarnings(sellerId) {
  const { rows } = await pool.query(
    `SELECT available_balance, total_revenue, withdrawn_amount, updated_at
     FROM seller_earnings WHERE user_id = $1`,
    [sellerId]
  );
  return rows[0] || { available_balance: 0, total_revenue: 0, withdrawn_amount: 0 };
}

async function getTransactions(sellerId) {
  const { rows } = await pool.query(
    `SELECT txn_ref AS id, description AS desc, type, amount, status, created_at AS date
     FROM transactions
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [sellerId]
  );
  return rows;
}

async function processWithdrawal(sellerId, amount) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows: earningRows } = await client.query(
      `UPDATE seller_earnings
       SET available_balance = available_balance - $1,
           withdrawn_amount  = withdrawn_amount  + $1,
           updated_at        = NOW()
       WHERE user_id = $2 AND available_balance >= $1
       RETURNING *`,
      [amount, sellerId]
    );
    if (earningRows.length === 0) throw new Error("Insufficient balance");

    const txnRef = `TXN-WD-${Date.now().toString().slice(-5)}`;
    const { rows: txnRow } = await client.query(
      `INSERT INTO transactions (user_id, txn_ref, description, type, amount, status)
       VALUES ($1, $2, 'Instant Cashfree Payout to Bank', 'PAYOUT', $3, 'Settled')
       RETURNING *`,
      [sellerId, txnRef, amount]
    );
    await client.query("COMMIT");
    return { earnings: earningRows[0], transaction: txnRow[0] };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

// ─── Seller Settings ──────────────────────────────────────────────────────────

async function getSettings(sellerId) {
  const { rows } = await pool.query(
    `SELECT shipping_fee, free_threshold, dispatch_time, return_policy, cod_allowed,
            whatsapp_alerts, sms_alerts, email_invoices
     FROM seller_settings WHERE user_id = $1`,
    [sellerId]
  );
  return rows[0] || null;
}

async function saveSettings(sellerId, data) {
  const {
    shippingFee, freeThreshold, dispatchTime, returnPolicy, codAllowed,
    whatsappAlerts, smsAlerts, emailInvoices,
  } = data;
  const { rows } = await pool.query(
    `INSERT INTO seller_settings
       (user_id, shipping_fee, free_threshold, dispatch_time, return_policy,
        cod_allowed, whatsapp_alerts, sms_alerts, email_invoices)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     ON CONFLICT (user_id) DO UPDATE SET
       shipping_fee     = EXCLUDED.shipping_fee,
       free_threshold   = EXCLUDED.free_threshold,
       dispatch_time    = EXCLUDED.dispatch_time,
       return_policy    = EXCLUDED.return_policy,
       cod_allowed      = EXCLUDED.cod_allowed,
       whatsapp_alerts  = EXCLUDED.whatsapp_alerts,
       sms_alerts       = EXCLUDED.sms_alerts,
       email_invoices   = EXCLUDED.email_invoices,
       updated_at       = NOW()
     RETURNING *`,
    [sellerId, shippingFee, freeThreshold, dispatchTime, returnPolicy,
     codAllowed, whatsappAlerts, smsAlerts, emailInvoices]
  );
  return rows[0];
}

module.exports = {
  getProductsBySeller, upsertProduct, deleteProduct,
  getOrdersBySeller, updateOrderFulfillment,
  getEarnings, getTransactions, processWithdrawal,
  getSettings, saveSettings,
};
