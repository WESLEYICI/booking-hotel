const Room = require('../Models/Room');

const roomController = {
  getAllRooms: async (req, res) => {
    try {
      const rooms = await Room.findAll();
      res.json({ success: true, data: rooms });
    } catch (err) {
      console.error('Error getting rooms:', err);
      res.status(500).json({ success: false, message: 'Gagal mengambil data kamar' });
    }
  },

  getRoomById: async (req, res) => {
    try {
      const room = await Room.findById(req.params.id);
      if (!room) return res.status(404).json({ success: false, message: 'Kamar tidak ditemukan' });
      res.json({ success: true, data: room });
    } catch (err) {
      console.error('Error getting room:', err);
      res.status(500).json({ success: false, message: 'Gagal mengambil data kamar' });
    }
  },

  createRoom: async (req, res) => {
    try {
      const newRoom = await Room.create(req.body);
      res.status(201).json({ success: true, data: newRoom });
    } catch (err) {
      console.error('Error creating room:', err);
      res.status(500).json({ success: false, message: 'Gagal membuat kamar baru' });
    }
  },

  updateRoom: async (req, res) => {
    try {
      await Room.update(req.params.id, req.body);
      res.json({ success: true, message: 'Kamar berhasil diupdate' });
    } catch (err) {
      console.error('Error updating room:', err);
      res.status(500).json({ success: false, message: 'Gagal update kamar' });
    }
  },

  deleteRoom: async (req, res) => {
    try {
      await Room.delete(req.params.id);
      res.json({ success: true, message: 'Kamar berhasil dihapus' });
    } catch (err) {
      console.error('Error deleting room:', err);
      res.status(500).json({ success: false, message: 'Gagal menghapus kamar' });
    }
  },

  checkAvailability: async (req, res) => {
    try {
      const { roomId, checkIn, checkOut } = req.body;
      if (!roomId || !checkIn || !checkOut) {
        return res.status(400).json({ success: false, message: 'Parameter tidak lengkap' });
      }
      const isAvailable = await Room.checkAvailability(roomId, checkIn, checkOut);
      res.json({ success: true, available: isAvailable });
    } catch (err) {
      console.error('Error checking availability:', err);
      res.status(500).json({ success: false, message: 'Gagal mengecek ketersediaan kamar' });
    }
  },

  searchAvailableRooms: async (req, res) => {
    try {
      const { checkIn, checkOut, guests } = req.query;
      if (!checkIn || !checkOut) {
        return res.status(400).json({ success: false, message: 'checkIn and checkOut query params are required' });
      }
      
      const minCapacity = guests ? parseInt(guests) : 1;
      const rooms = await Room.findWithAvailabilityStatus(checkIn, checkOut, minCapacity);
      res.json({ success: true, data: rooms });
    } catch (err) {
      console.error('Error searching rooms:', err);
      res.status(500).json({ success: false, message: 'Gagal mencari kamar yang tersedia' });
    }
  }
};

module.exports = roomController;
