const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/', roomController.getAllRooms);
router.get('/available', roomController.searchAvailableRooms);
router.get('/:id', roomController.getRoomById);
router.post('/check-availability', roomController.checkAvailability);

// Admin only routes
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'image_2', maxCount: 1 }]),
  roomController.createRoom
);
router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'image_2', maxCount: 1 }]),
  roomController.updateRoom
);
router.delete('/:id', authMiddleware, adminMiddleware, roomController.deleteRoom);

module.exports = router;
