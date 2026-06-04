const db = require('../config/db');

class Payment {
  static async create(paymentData) {
    const {
      booking_id,
      order_id,
      gross_amount,
      transaction_status,
      payment_type = null,
      transaction_time = null,
      snap_token = null,
      redirect_url = null,
    } = paymentData;
    const [result] = await db.query(
      `INSERT INTO payments 
       (booking_id, order_id, gross_amount, transaction_status, payment_type, transaction_time, snap_token, redirect_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [booking_id, order_id, gross_amount, transaction_status, payment_type, transaction_time, snap_token, redirect_url]
    );
    return { id: result.insertId, ...paymentData };
  }

  static async findAll() {
    const [rows] = await db.query('SELECT * FROM payments ORDER BY created_at DESC');
    return rows;
  }

  static async findByOrderId(orderId) {
    const [rows] = await db.query('SELECT * FROM payments WHERE order_id = ?', [orderId]);
    return rows[0];
  }

  static async updateStatus(orderId, transactionStatus) {
    const [result] = await db.query('UPDATE payments SET transaction_status = ? WHERE order_id = ?', [transactionStatus, orderId]);
    return result;
  }
}

module.exports = Payment;
