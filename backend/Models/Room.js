const db = require('../config/db');

class Room {
  static async findAll() {
    const [rows] = await db.query('SELECT * FROM rooms ORDER BY id ASC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM rooms WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(roomData) {
    const { name, price, capacity, size, facility, description, amenities, image_url, image_url_2 } = roomData;
    const [result] = await db.query(
      `INSERT INTO rooms (name, price, capacity, size, facility, description, amenities, image_url, image_url_2)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, price, capacity, size, facility, description, amenities, image_url, image_url_2]
    );
    return { id: result.insertId, ...roomData };
  }

  static async update(id, roomData) {
    const { name, price, capacity, size, facility, description, amenities, image_url, image_url_2 } = roomData;
    const [result] = await db.query(
      `UPDATE rooms 
       SET name=?, price=?, capacity=?, size=?, facility=?, description=?, amenities=?, image_url=?, image_url_2=?
       WHERE id=?`,
      [name, price, capacity, size, facility, description, amenities, image_url, image_url_2, id]
    );
    return result;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM rooms WHERE id = ?', [id]);
    return result;
  }

  // Cek ketersediaan kamar: cari apakah ada booking yang statusnya tidak 'cancelled'
  // dan rentang tanggalnya overlap dengan check_in & check_out yang diminta
  static async checkAvailability(roomId, checkIn, checkOut) {
    const [rows] = await db.query(
      `SELECT COUNT(*) as conflicting_bookings
       FROM bookings 
       WHERE room_id = ? 
         AND status != 'cancelled'
         AND (
           (check_in < ? AND check_out > ?) -- Overlaps
         )`,
      [roomId, checkOut, checkIn]
    );
    return rows[0].conflicting_bookings === 0; // True jika 0 conflict = available
  }
  static async findWithAvailabilityStatus(checkIn, checkOut, minCapacity = 1) {
    const [rows] = await db.query(
      `SELECT r.*,
        CASE WHEN (
          SELECT COUNT(*) FROM bookings b 
          WHERE b.room_id = r.id 
            AND b.status != 'cancelled' 
            AND (b.check_in < ? AND b.check_out > ?)
        ) = 0 THEN true ELSE false END as is_available
       FROM rooms r
       WHERE r.capacity >= ?
       ORDER BY r.id ASC`,
      [checkOut, checkIn, minCapacity]
    );
    return rows;
  }
}

module.exports = Room;
