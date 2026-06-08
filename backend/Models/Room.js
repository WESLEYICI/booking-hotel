const db = require('../config/db');

class Room {
  static async findAll() {
    const today = new Date().toISOString().split('T')[0];
    const [rows] = await db.query(
      `SELECT r.*,
        -- Hitung booking CONFIRMED yang aktif hari ini (bukan pending)
        (
          SELECT COUNT(*) FROM bookings b
          WHERE b.room_id = r.id
            AND b.status = 'confirmed'
            AND b.check_in <= ? AND b.check_out > ?
        ) AS booked_units,
        -- Unit tersedia = total - yang sudah confirmed
        GREATEST(0, r.total_units - (
          SELECT COUNT(*) FROM bookings b
          WHERE b.room_id = r.id
            AND b.status = 'confirmed'
            AND b.check_in <= ? AND b.check_out > ?
        )) AS available_units,
        -- is_available true jika masih ada unit tersisa
        CASE WHEN r.total_units > (
          SELECT COUNT(*) FROM bookings b
          WHERE b.room_id = r.id
            AND b.status = 'confirmed'
            AND b.check_in <= ? AND b.check_out > ?
        ) THEN true ELSE false END AS is_available
       FROM rooms r
       WHERE r.is_active = true
       ORDER BY r.id ASC`,
      [today, today, today, today, today, today]
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM rooms WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(roomData) {
    const { name, price, capacity, size, facility, description, amenities, image_url, image_url_2, total_units = 1 } = roomData;
    const [result] = await db.query(
      `INSERT INTO rooms (name, price, capacity, size, facility, description, amenities, image_url, image_url_2, total_units)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, price, capacity, size, facility, description, amenities, image_url, image_url_2, total_units]
    );
    return { id: result.insertId, ...roomData };
  }

  static async update(id, roomData) {
    const { name, price, capacity, size, facility, description, amenities, image_url, image_url_2, total_units } = roomData;
    const [result] = await db.query(
      `UPDATE rooms 
       SET name=?, price=?, capacity=?, size=?, facility=?, description=?, amenities=?, image_url=?, image_url_2=?, total_units=?
       WHERE id=?`,
      [name, price, capacity, size, facility, description, amenities, image_url, image_url_2, total_units || 1, id]
    );
    return result;
  }

  static async delete(id) {
    const [result] = await db.query('UPDATE rooms SET is_active = false WHERE id = ?', [id]);
    return result;
  }

  // Cek ketersediaan: apakah masih ada unit yang belum di-confirm untuk rentang tanggal ini
  // Pending TIDAK dihitung — hanya confirmed yang "mengunci" unit
  static async checkAvailability(roomId, checkIn, checkOut) {
    const [roomRows] = await db.query('SELECT total_units FROM rooms WHERE id = ?', [roomId]);
    if (!roomRows[0]) return false;
    const totalUnits = roomRows[0].total_units;

    const [rows] = await db.query(
      `SELECT COUNT(*) as confirmed_bookings
       FROM bookings 
       WHERE room_id = ? 
         AND status = 'confirmed'
         AND (check_in < ? AND check_out > ?)`,
      [roomId, checkOut, checkIn]
    );
    // Tersedia jika jumlah confirmed < total unit
    return rows[0].confirmed_bookings < totalUnits;
  }

  static async findWithAvailabilityStatus(checkIn, checkOut, minCapacity = 1) {
    const [rows] = await db.query(
      `SELECT r.*,
        GREATEST(0, r.total_units - (
          SELECT COUNT(*) FROM bookings b 
          WHERE b.room_id = r.id 
            AND b.status = 'confirmed'
            AND (b.check_in < ? AND b.check_out > ?)
        )) AS available_units,
        CASE WHEN r.total_units > (
          SELECT COUNT(*) FROM bookings b 
          WHERE b.room_id = r.id 
            AND b.status = 'confirmed'
            AND (b.check_in < ? AND b.check_out > ?)
        ) THEN true ELSE false END AS is_available
       FROM rooms r
       WHERE r.capacity >= ? AND r.is_active = true
       ORDER BY r.id ASC`,
      [checkOut, checkIn, checkOut, checkIn, minCapacity]
    );
    return rows;
  }
}

module.exports = Room;
