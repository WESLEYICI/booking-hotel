const db = require('./config/db');

(async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS vouchers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) NOT NULL UNIQUE,
        diskon INT NOT NULL,
        tanggal_mulai DATE NOT NULL,
        tanggal_akhir DATE NOT NULL,
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        max_uses INT DEFAULT NULL,
        used_count INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Tabel vouchers berhasil dibuat');
    const [[{ c }]] = await db.query('SELECT COUNT(*) as c FROM vouchers');
    console.log('Vouchers saat ini:', c);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit();
  }
})();
