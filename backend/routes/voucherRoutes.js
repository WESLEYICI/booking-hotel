const express = require('express');
const router = express.Router();
const voucherController = require('../controllers/voucherController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

// User: validasi kode voucher saat booking
router.post('/validate', authMiddleware, voucherController.validate);

// Admin: CRUD voucher
router.get('/', authMiddleware, adminMiddleware, voucherController.getAll);
router.post('/', authMiddleware, adminMiddleware, voucherController.create);
router.patch('/:id/deactivate', authMiddleware, adminMiddleware, voucherController.deactivate);
router.patch('/:id/activate', authMiddleware, adminMiddleware, voucherController.activate);
router.delete('/:id', authMiddleware, adminMiddleware, voucherController.delete);

module.exports = router;
