const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');
const upload = require('../config/multer'); // Untuk handle file upload

router.post('/', authMiddleware, upload.single('payment_proof'), bookingController.createBooking);
router.get('/my-bookings', authMiddleware, bookingController.getUserBookings);
router.get('/all', authMiddleware, bookingController.getAllBookings);
router.get('/all-payments', authMiddleware, adminMiddleware, bookingController.getAllPayments);
router.patch('/:id/status', authMiddleware, bookingController.updateBookingStatus);
router.delete('/:id', authMiddleware, bookingController.deleteBooking);
router.post('/midtrans-webhook', bookingController.midtransWebhook);

module.exports = router;
