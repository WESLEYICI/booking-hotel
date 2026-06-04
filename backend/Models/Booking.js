const db = require('../config/db');

class Booking {
  static async create(bookingData) {
    const { user_id, room_id, name, nama, email, phone_number, check_in, check_out, harga, payment_proof, status } = bookingData;
    const [result] = await db.query(
      `INSERT INTO bookings 
       (user_id, room_id, name, nama, email, phone_number, check_in, check_out, harga, status, payment_proof) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, room_id, name, nama, email, phone_number, check_in, check_out, harga, status, payment_proof]
    );
    return { id: result.insertId, ...bookingData };
  }

  static async findByUserId(userId) {
    const [rows] = await db.query(
      `SELECT b.*, p.order_id, p.transaction_status, p.payment_type, p.transaction_time
       FROM bookings b
       LEFT JOIN payments p ON p.booking_id = b.id
       WHERE b.user_id = ?
       ORDER BY b.created_at DESC`,
      [userId]
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(
      `SELECT b.*, p.order_id, p.transaction_status, p.payment_type, p.transaction_time
       FROM bookings b
       LEFT JOIN payments p ON p.booking_id = b.id
       WHERE b.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findAll() {
    const [rows] = await db.query(
      `SELECT b.*, u.name as user_name, p.order_id, p.transaction_status, p.payment_type, p.transaction_time
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       LEFT JOIN payments p ON p.booking_id = b.id
       ORDER BY b.created_at DESC`
    );
    return rows;
  }
  static async delete(id) {
    const [result] = await db.query('DELETE FROM bookings WHERE id = ?', [id]);
    return result;
  }
  static async updateStatus(id, status) {
    try {
      const [result] = await db.query('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);

      if (result.affectedRows === 0) {
        throw new Error('Tidak ada booking yang terupdate');
      }

      return { id, status };
    } catch (err) {
      console.error('Database error in updateStatus:', err);
      throw err;
    }
  }
}

module.exports = Booking;
