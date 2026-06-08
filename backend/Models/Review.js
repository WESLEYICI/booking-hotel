const db = require('../config/db');

class Review {
  static async create(reviewData) {
    const { user_id, room_id, booking_id, rating, comment } = reviewData;
    const [result] = await db.query(
      `INSERT INTO reviews (user_id, room_id, booking_id, rating, comment) 
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, room_id, booking_id, rating, comment]
    );
    return { id: result.insertId, ...reviewData };
  }

  static async findByRoomId(roomId) {
    const [rows] = await db.query(
      `SELECT r.*, u.name as user_name 
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.room_id = ?
       ORDER BY r.created_at DESC`,
      [roomId]
    );
    return rows;
  }

  static async getRoomAverageRating(roomId) {
    const [[result]] = await db.query(
      `SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews 
       FROM reviews 
       WHERE room_id = ?`,
      [roomId]
    );
    return {
      avg_rating: result.avg_rating ? Number(result.avg_rating).toFixed(1) : 0,
      total_reviews: result.total_reviews || 0
    };
  }

  static async findAll() {
    const [rows] = await db.query(
      `SELECT r.*, u.name as user_name, rm.name as room_name 
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       JOIN rooms rm ON r.room_id = rm.id
       ORDER BY r.created_at DESC`
    );
    return rows;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM reviews WHERE id = ?', [id]);
    return result;
  }
}

module.exports = Review;
