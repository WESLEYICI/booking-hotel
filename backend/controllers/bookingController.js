const Booking = require('../Models/Booking.js');
const Payment = require('../Models/Payment.js');
const Voucher = require('../Models/Voucher.js');
const paymentGateway = require('../services/paymentGateway');

const bookingController = {
  createBooking: async (req, res) => {
    try {
      const payment_type = req.body.payment_type || 'all';

      const bookingData = {
        user_id: req.user.id,
        room_id: req.body.room_id || null,
        name: req.body.name,
        nama: req.body.nama,
        email: req.body.email,
        phone_number: req.body.phone_number,
        check_in: req.body.check_in,
        check_out: req.body.check_out,
        harga: req.body.harga,
        status: 'pending',
        payment_proof: req.file ? `/uploads/${req.file.filename}` : null,
      };

      const booking = await Booking.create(bookingData);

      // Increment usage count of the voucher if one was provided
      if (req.body.voucher_code) {
        await Voucher.incrementUsed(req.body.voucher_code);
      }

      const payment = await paymentGateway.createPaymentSession({
        booking_id: booking.id,
        amount: bookingData.harga,
        payment_type,
        customer: {
          nama: bookingData.nama || bookingData.name,
          email: bookingData.email,
          phone_number: bookingData.phone_number,
        },
        item_name: 'Hotel Booking',
      });

      res.status(201).json({ booking, payment });
    } catch (err) {
      console.error('Create booking error:', err);
      res.status(500).json({ message: err.message || 'Server error' });
    }
  },

  getUserBookings: async (req, res) => {
    try {
      const bookings = await Booking.findByUserId(req.user.id);
      res.json(bookings);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getAllBookings: async (req, res) => {
    try {
      const bookings = await Booking.findAll();
      res.json({ success: true, data: bookings });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getAllPayments: async (req, res) => {
    try {
      const payments = await Payment.findAll();
      res.json(payments);
    } catch (err) {
      console.error('Get all payments error:', err);
      res.status(500).json({ message: err.message || 'Server error' });
    }
  },

  getStats: async (req, res) => {
    try {
      const db = require('../config/db');
      const today = new Date().toISOString().split('T')[0];

      // Hitung booking yang confirmed dan aktif hari ini (check_in <= today < check_out)
      const [[{ active_bookings }]] = await db.query(
        `SELECT COUNT(*) as active_bookings FROM bookings 
         WHERE status = 'confirmed' AND check_in <= ? AND check_out > ?`,
        [today, today]
      );

      // Total kamar aktif
      const [[{ total_rooms }]] = await db.query(
        `SELECT SUM(total_units) as total_rooms FROM rooms WHERE is_active = true`
      );

      res.json({
        active_confirmed_bookings: Number(active_bookings),
        total_rooms: Number(total_rooms) || 0,
        occupancy_rate: total_rooms > 0 ? Math.round((active_bookings / total_rooms) * 100) : 0,
      });
    } catch (err) {
      console.error('Get stats error:', err);
      res.status(500).json({ message: err.message || 'Server error' });
    }
  },

  getAnalytics: async (req, res) => {
    try {
      const db = require('../config/db');
      
      // 1. Monthly Revenue (Last 6 Months)
      // Using ANY_VALUE to bypass strict ONLY_FULL_GROUP_BY rules on formatting dates
      const [revenueData] = await db.query(`
        SELECT 
          ANY_VALUE(DATE_FORMAT(created_at, '%b %Y')) as name,
          DATE_FORMAT(created_at, '%Y-%m') as month_sort,
          SUM(harga) as total
        FROM bookings
        WHERE status = 'confirmed'
          AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY month_sort ASC
      `);

      // 2. Popular Rooms (All time confirmed)
      const [popularRooms] = await db.query(`
        SELECT 
          ANY_VALUE(r.name) as name,
          COUNT(b.id) as total_bookings
        FROM bookings b
        JOIN rooms r ON b.room_id = r.id
        WHERE b.status = 'confirmed'
        GROUP BY r.id
        ORDER BY total_bookings DESC
        LIMIT 5
      `);

      res.json({
        success: true,
        data: {
          revenue: revenueData,
          popularRooms: popularRooms
        }
      });
    } catch (err) {
      console.error('Get analytics error:', err);
      require('fs').writeFileSync('debug_analytics_error.txt', err.message);
      res.status(500).json({ message: err.message || 'Server error' });
    }
  },

  updateBookingStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!id || !status) {
        return res.status(400).json({
          success: false,
          message: 'ID booking dan status wajib diisi',
        });
      }

      const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Status tidak valid. Gunakan: ${validStatuses.join(', ')}`,
        });
      }

      const updatedBooking = await Booking.updateStatus(id, status);
      if (!updatedBooking) {
        return res.status(404).json({
          success: false,
          message: 'Booking tidak ditemukan',
        });
      }

      // Jika diubah menjadi confirmed oleh admin, kirim email
      if (status === 'confirmed') {
        try {
          const db = require('../config/db');
          const { sendInvoiceEmail } = require('../services/mailer');
          const [[bookingData]] = await db.query('SELECT b.*, u.email, u.name as user_name FROM bookings b JOIN users u ON b.user_id = u.id WHERE b.id = ?', [id]);
          if (bookingData && bookingData.email) {
            await sendInvoiceEmail(bookingData, bookingData.email, bookingData.user_name || bookingData.nama);
          }
        } catch (mailErr) {
          console.error('Error sending invoice email via admin manual update:', mailErr);
        }
      }

      res.json({
        success: true,
        data: updatedBooking,
      });
    } catch (err) {
      console.error('Error updating status:', err);
      res.status(500).json({ success: false, message: 'Gagal update status' });
    }
  },
  deleteBooking: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID booking tidak valid',
        });
      }

      const result = await Booking.delete(id);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Booking tidak ditemukan',
        });
      }

      res.json({
        success: true,
        message: 'Booking berhasil dihapus',
      });
    } catch (err) {
      console.error('Delete booking error:', err);
      res.status(500).json({
        success: false,
        message: 'Gagal menghapus booking',
      });
    }
  },
  midtransWebhook: async (req, res) => {
    try {
      const { order_id, transaction_status, fraud_status, payment_type, transaction_time } = req.body;

      if (!order_id) {
        return res.status(400).json({ message: 'Missing order_id' });
      }

      const payments = await Payment.findAll();
      const payment = payments.find(p => p.order_id === order_id);

      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }

      const db = require('../config/db');
      let mappedStatus;
      if (transaction_status === 'capture' || transaction_status === 'settlement') {
        mappedStatus = 'settlement';
      } else if (transaction_status === 'pending') {
        mappedStatus = 'pending';
      } else if (transaction_status === 'deny' || transaction_status === 'cancel' || transaction_status === 'expire') {
        mappedStatus = 'failure';
      } else {
        mappedStatus = transaction_status;
      }

      await db.query(
        `UPDATE payments SET transaction_status = ?, payment_type = COALESCE(?, payment_type), transaction_time = COALESCE(?, transaction_time) WHERE order_id = ?`,
        [mappedStatus, payment_type, transaction_time, order_id]
      );

      if (mappedStatus === 'settlement') {
        await db.query(`UPDATE bookings SET status = 'confirmed' WHERE id = ?`, [payment.booking_id]);

        // Kirim email invoice otomatis
        try {
          const { sendInvoiceEmail } = require('../services/mailer');
          const [[bookingData]] = await db.query('SELECT b.*, u.email, u.name as user_name FROM bookings b JOIN users u ON b.user_id = u.id WHERE b.id = ?', [payment.booking_id]);
          if (bookingData && bookingData.email) {
            await sendInvoiceEmail(bookingData, bookingData.email, bookingData.user_name || bookingData.nama);
          }
        } catch (mailErr) {
          console.error('Error sending invoice email via webhook:', mailErr);
        }

      } else if (mappedStatus === 'failure') {
        await db.query(`UPDATE bookings SET status = 'cancelled' WHERE id = ?`, [payment.booking_id]);
      }

      res.status(200).json({ message: 'OK' });
    } catch (err) {
      console.error('Midtrans webhook error:', err);
      res.status(500).json({ message: err.message || 'Server error' });
    }
  },
  // Generate ulang snap token untuk booking yang sudah ada (ganti metode pembayaran)
  refreshPaymentToken: async (req, res) => {
    try {
      const { id } = req.params;
      const payment_type = req.body.payment_type || 'all';

      // Cari booking milik user
      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({ message: 'Booking tidak ditemukan' });
      }
      if (booking.user_id !== req.user.id) {
        return res.status(403).json({ message: 'Akses ditolak' });
      }
      if (booking.status !== 'pending') {
        return res.status(400).json({ message: 'Hanya booking berstatus pending yang bisa di-refresh' });
      }

      // Panggil Midtrans untuk dapat token baru
      const { createSnapToken } = require('../services/paymentGateway');
      const order_id = `ORDER-${booking.id}-${Date.now()}`;
      const result = await createSnapToken({
        booking_id: booking.id,
        order_id,
        amount: booking.harga,
        payment_type,
        customer: {
          nama: booking.nama || booking.name,
          email: booking.email,
          phone_number: booking.phone_number,
        },
        item_name: 'Hotel Booking',
      });

      // UPDATE record payment yang sudah ada (jangan INSERT baru)
      await Payment.updateByBookingId(booking.id, {
        order_id,
        snap_token: result.snap_token,
        redirect_url: result.redirect_url,
        payment_type: payment_type !== 'all' ? payment_type : null,
      });

      res.json({ snap_token: result.snap_token });
    } catch (err) {
      console.error('Refresh payment token error:', err);
      res.status(500).json({ message: err.message || 'Server error' });
    }
  },
};

module.exports = bookingController;
