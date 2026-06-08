const db = require('../config/db');

class Voucher {
  // Ambil semua voucher (terbaru duluan)
  static async findAll() {
    const [rows] = await db.query(
      'SELECT * FROM vouchers ORDER BY created_at DESC'
    );
    return rows;
  }

  // Buat voucher baru
  static async create({ code, diskon, tanggal_mulai, tanggal_akhir, max_uses }) {
    const [result] = await db.query(
      `INSERT INTO vouchers (code, diskon, tanggal_mulai, tanggal_akhir, max_uses)
       VALUES (?, ?, ?, ?, ?)`,
      [code.toUpperCase(), diskon, tanggal_mulai, tanggal_akhir, max_uses || null]
    );
    return { id: result.insertId, code, diskon, tanggal_mulai, tanggal_akhir };
  }

  // Nonaktifkan voucher (soft delete)
  static async deactivate(id) {
    const [result] = await db.query(
      'UPDATE vouchers SET is_active = 0 WHERE id = ?',
      [id]
    );
    return result;
  }

  // Aktifkan voucher kembali
  static async activate(id) {
    const [result] = await db.query(
      'UPDATE vouchers SET is_active = 1 WHERE id = ?',
      [id]
    );
    return result;
  }

  // Hapus permanen
  static async delete(id) {
    const [result] = await db.query('DELETE FROM vouchers WHERE id = ?', [id]);
    return result;
  }

  // Validasi kode voucher (untuk dipakai user saat booking)
  static async validateCode(code) {
    const today = new Date().toISOString().split('T')[0];
    const [rows] = await db.query(
      `SELECT * FROM vouchers
       WHERE code = ?
         AND is_active = 1
         AND tanggal_mulai <= ?
         AND tanggal_akhir >= ?
         AND (max_uses IS NULL OR used_count < max_uses)`,
      [code.toUpperCase(), today, today]
    );
    return rows[0] || null;
  }

  // Tambah used_count setelah voucher dipakai
  static async incrementUsed(code) {
    await db.query(
      'UPDATE vouchers SET used_count = used_count + 1 WHERE code = ?',
      [code.toUpperCase()]
    );
  }
}

module.exports = Voucher;
