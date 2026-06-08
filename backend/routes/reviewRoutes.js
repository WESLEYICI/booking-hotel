const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Get ulasan kamar (Bisa diakses publik)
router.get('/room/:roomId', reviewController.getRoomReviews);

// Get semua ulasan (Harus login, idealnya admin)
router.get('/', authMiddleware, reviewController.getAllReviews);

// Hapus ulasan (Harus login, idealnya admin)
router.delete('/:id', authMiddleware, reviewController.deleteReview);

// Post ulasan baru (Harus login dan pernah menginap)
router.post('/', authMiddleware, reviewController.createReview);

module.exports = router;
