const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

router.get('/', roomController.getAllRooms);
router.get('/available', roomController.searchAvailableRooms);
router.get('/:id', roomController.getRoomById);
router.post('/check-availability', roomController.checkAvailability);

// Admin only routes
router.post('/', authMiddleware, adminMiddleware, roomController.createRoom);
router.put('/:id', authMiddleware, adminMiddleware, roomController.updateRoom);
router.delete('/:id', authMiddleware, adminMiddleware, roomController.deleteRoom);

module.exports = router;
