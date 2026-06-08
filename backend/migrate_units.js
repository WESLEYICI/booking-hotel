const db = require('./config/db');

(async () => {
  try {
    const [[{ c }]] = await db.query(
      `SELECT COUNT(*) as c FROM information_schema.COLUMNS 
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'rooms' AND COLUMN_NAME = 'total_units'`
    );
    if (c > 0) {
      console.log('✓ Kolom total_units sudah ada, tidak perlu migrasi');
    } else {
      await db.query('ALTER TABLE rooms ADD COLUMN total_units INT NOT NULL DEFAULT 1');
      console.log('✓ Kolom total_units berhasil ditambahkan (default: 1 unit)');
    }

    // Pastikan semua kamar punya minimal 1 unit
    await db.query('UPDATE rooms SET total_units = 1 WHERE total_units < 1');
    
    const [rooms] = await db.query('SELECT id, name, total_units FROM rooms WHERE is_active = true');
    console.log('\nKamar saat ini:');
    rooms.forEach(r => console.log(`  R-${String(r.id).padStart(3,'0')}: ${r.name} — ${r.total_units} unit`));
  } catch (err) {
    console.error('Migration error:', err.message);
  } finally {
    process.exit();
  }
})();
