const Voucher = require('../Models/Voucher');

const voucherController = {
  // GET /api/vouchers — daftar semua voucher (admin)
  getAll: async (req, res) => {
    try {
      const vouchers = await Voucher.findAll();
      res.json({ success: true, data: vouchers });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // POST /api/vouchers — buat voucher baru (admin)
  create: async (req, res) => {
    try {
      const { code, diskon, tanggal_mulai, tanggal_akhir, max_uses } = req.body;

      if (!code || !diskon || !tanggal_mulai || !tanggal_akhir) {
        return res.status(400).json({ message: 'Semua field wajib diisi' });
      }
      if (diskon < 1 || diskon > 100) {
        return res.status(400).json({ message: 'Diskon harus antara 1-100%' });
      }
      if (new Date(tanggal_akhir) < new Date(tanggal_mulai)) {
        return res.status(400).json({ message: 'Tanggal akhir tidak boleh sebelum tanggal mulai' });
      }

      const voucher = await Voucher.create({ code, diskon, tanggal_mulai, tanggal_akhir, max_uses });
      res.status(201).json({ success: true, data: voucher });
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: `Kode voucher "${req.body.code?.toUpperCase()}" sudah digunakan` });
      }
      res.status(500).json({ message: err.message });
    }
  },

  // PATCH /api/vouchers/:id/deactivate — nonaktifkan voucher (admin)
  deactivate: async (req, res) => {
    try {
      await Voucher.deactivate(req.params.id);
      res.json({ success: true, message: 'Voucher dinonaktifkan' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // PATCH /api/vouchers/:id/activate — aktifkan kembali (admin)
  activate: async (req, res) => {
    try {
      await Voucher.activate(req.params.id);
      res.json({ success: true, message: 'Voucher diaktifkan' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // DELETE /api/vouchers/:id — hapus permanen (admin)
  delete: async (req, res) => {
    try {
      await Voucher.delete(req.params.id);
      res.json({ success: true, message: 'Voucher dihapus' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // POST /api/vouchers/validate — validasi kode voucher (user saat booking)
  validate: async (req, res) => {
    try {
      const { code, harga } = req.body;
      if (!code) return res.status(400).json({ message: 'Kode voucher wajib diisi' });

      const voucher = await Voucher.validateCode(code);
      if (!voucher) {
        return res.status(404).json({ message: 'Voucher tidak valid, sudah habis, atau belum aktif' });
      }

      const hargaAsli = parseFloat(harga) || 0;
      const potongan = Math.round(hargaAsli * (voucher.diskon / 100));
      const hargaSetelahDiskon = Math.max(0, hargaAsli - potongan);

      res.json({
        success: true,
        data: {
          id: voucher.id,
          code: voucher.code,
          diskon: voucher.diskon,
          potongan,
          harga_setelah_diskon: hargaSetelahDiskon,
        },
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = voucherController;
