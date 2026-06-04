const Room = require('../Models/Room');
const path = require('path');

// Helper: dapatkan URL publik dari file yang diupload
const getFileUrl = (req, file) => {
  if (!file) return null;
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  return `${baseUrl}/uploads/${file.filename}`;
};

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
      const { name, price, capacity, size, facility, description, amenities } = req.body;

      // Gambar wajib ada saat create
      if (!req.files || !req.files['image']) {
        return res.status(400).json({ success: false, message: 'Gambar utama kamar wajib diunggah' });
      }

      const image_url   = getFileUrl(req, req.files['image'][0]);
      const image_url_2 = req.files['image_2']
        ? getFileUrl(req, req.files['image_2'][0])
        : image_url; // fallback ke gambar 1

      const newRoom = await Room.create({
        name, price, capacity, size, facility, description, amenities,
        image_url, image_url_2,
      });
      res.status(201).json({ success: true, data: newRoom });
    } catch (err) {
      console.error('Error creating room:', err);
      res.status(500).json({ success: false, message: 'Gagal membuat kamar baru' });
    }
  },

  updateRoom: async (req, res) => {
    try {
      const existing = await Room.findById(req.params.id);
      if (!existing) return res.status(404).json({ success: false, message: 'Kamar tidak ditemukan' });

      const { name, price, capacity, size, facility, description, amenities } = req.body;

      // Gunakan file baru jika ada, jika tidak pertahankan yang lama
      const image_url   = req.files && req.files['image']
        ? getFileUrl(req, req.files['image'][0])
        : existing.image_url;

      const image_url_2 = req.files && req.files['image_2']
        ? getFileUrl(req, req.files['image_2'][0])
        : existing.image_url_2;

      await Room.update(req.params.id, {
        name, price, capacity, size, facility, description, amenities,
        image_url, image_url_2,
      });
      res.json({ success: true, message: 'Kamar berhasil diupdate' });
    } catch (err) {
      console.error('Error updating room:', err);
      res.status(500).json({ success: false, message: 'Gagal update kamar' });
    }
  },

  deleteRoom: async (req, res) => {
    try {
      await Room.delete(req.params.id);
      res.json({ success: true, message: 'Kamar berhasil dinonaktifkan' });
    } catch (err) {
      console.error('Error deleting room:', err);
      res.status(500).json({ success: false, message: 'Gagal menonaktifkan kamar' });
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
