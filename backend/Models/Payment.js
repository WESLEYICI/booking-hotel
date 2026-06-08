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
  // Update snap_token pada payment terakhir milik booking (jangan insert baru)
  static async updateByBookingId(bookingId, { order_id, snap_token, redirect_url, payment_type }) {
    await db.query(
      `UPDATE payments 
       SET order_id = ?, snap_token = ?, redirect_url = ?, payment_type = COALESCE(?, payment_type)
       WHERE booking_id = ?
       ORDER BY id DESC
       LIMIT 1`,
      [order_id, snap_token, redirect_url, payment_type, bookingId]
    );
  }
}

module.exports = Payment;
