const db = require('../config/db');

// Fungsi untuk membatalkan booking yang sudah expired
const cancelExpiredBookings = async () => {
  try {
    // Cari semua booking pending yang dibuat lebih dari 1 jam yang lalu
    const [rows] = await db.query(`
      SELECT id FROM bookings 
      WHERE status = 'pending' 
      AND created_at < NOW() - INTERVAL 1 HOUR
    `);

    if (rows.length > 0) {
      const ids = rows.map(r => r.id);
      
      // Update status menjadi cancelled
      await db.query(`
        UPDATE bookings 
        SET status = 'cancelled' 
        WHERE id IN (?)
      `, [ids]);
      
      console.log(`[Auto-Cancel] ${ids.length} booking(s) kedaluwarsa dibatalkan (IDs: ${ids.join(', ')}). Kamar kembali tersedia.`);
    }
  } catch (err) {
    console.error('[Auto-Cancel] Error saat membatalkan booking:', err);
  }
};

// Fungsi untuk memulai service Auto-Cancel
const startAutoCancelService = () => {
  console.log('[Auto-Cancel Service] Berjalan. Mengecek booking kedaluwarsa setiap 15 menit...');
  
  // Cek pertama kali saat server menyala
  cancelExpiredBookings();
  
  // Lalu jalankan secara berkala setiap 15 menit (15 * 60 * 1000 = 900000 ms)
  setInterval(cancelExpiredBookings, 15 * 60 * 1000);
};

module.exports = {
  startAutoCancelService
};
