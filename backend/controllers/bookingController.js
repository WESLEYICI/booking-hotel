const Booking = require('../Models/Booking.js');
const paymentGateway = require('../services/paymentGateway');

const bookingController = {
  createBooking: async (req, res) => {
    try {
      const payment_type = req.body.payment_type || 'bank_transfer';

      const bookingData = {
        user_id: req.user.id,
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

      const payment = await paymentGateway.createPaymentSession({
        booking_id: booking.id,
        amount: bookingData.harga,
        payment_type,
        customer: {
          nama: req.body.nama || req.body.name,
          email: req.body.email,
          phone: req.body.phone_number
        },
        item_name: 'Hotel Booking'
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

      const validStatuses = ['pending', 'confirmed', 'cancelled'];
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
      const { order_id, transaction_status } = req.body;
      const Payment = require('../Models/Payment');
      
      const payment = await Payment.findByOrderId(order_id);
      if (payment) {
        await Payment.updateStatus(order_id, transaction_status);
        
        if (transaction_status === 'settlement' || transaction_status === 'capture') {
          await Booking.updateStatus(payment.booking_id, 'confirmed');
        } else if (transaction_status === 'cancel' || transaction_status === 'expire' || transaction_status === 'deny') {
          await Booking.updateStatus(payment.booking_id, 'cancelled');
        }
      }
      
      res.status(200).json({ status: 'success' });
    } catch (err) {
      console.error('Webhook error:', err);
      res.status(500).json({ status: 'error', message: err.message });
    }
  },
};

module.exports = bookingController;
