const Review = require('../Models/Review');
const Booking = require('../Models/Booking');

const reviewController = {
  createReview: async (req, res) => {
    try {
      const { booking_id, room_id, rating, comment } = req.body;
      const user_id = req.user.id;

      if (!booking_id || !room_id || !rating) {
        return res.status(400).json({ success: false, message: 'Harap lengkapi semua field yang wajib' });
      }

      // Validasi: Pastikan booking ini milik user dan berstatus completed
      const booking = await Booking.findById(booking_id);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking tidak ditemukan' });
      }
      if (booking.user_id !== user_id) {
        return res.status(403).json({ success: false, message: 'Anda tidak berhak memberi ulasan untuk booking ini' });
      }
      if (booking.status !== 'completed' && booking.status !== 'checked-out') {
        return res.status(400).json({ success: false, message: 'Ulasan hanya dapat diberikan setelah Anda selesai menginap (completed)' });
      }

      // Buat ulasan
      const review = await Review.create({ user_id, room_id, booking_id, rating, comment });
      res.status(201).json({ success: true, message: 'Ulasan berhasil ditambahkan', data: review });
    } catch (err) {
      // ER_DUP_ENTRY indicates that this booking has already been reviewed
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ success: false, message: 'Anda sudah memberikan ulasan untuk booking ini' });
      }
      console.error('Create review error:', err);
      res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
  },

  getRoomReviews: async (req, res) => {
    try {
      const { roomId } = req.params;
      const reviews = await Review.findByRoomId(roomId);
      const stats = await Review.getRoomAverageRating(roomId);

      res.json({
        success: true,
        data: reviews,
        stats
      });
    } catch (err) {
      console.error('Get room reviews error:', err);
      res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
  },

  getAllReviews: async (req, res) => {
    try {
      const reviews = await Review.findAll();
      res.json({ success: true, data: reviews });
    } catch (err) {
      console.error('Get all reviews error:', err);
      res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
  },

  deleteReview: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Review.delete(id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Ulasan tidak ditemukan' });
      }
      res.json({ success: true, message: 'Ulasan berhasil dihapus' });
    } catch (err) {
      console.error('Delete review error:', err);
      res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
  }
};

module.exports = reviewController;
