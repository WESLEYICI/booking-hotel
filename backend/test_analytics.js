const db = require('./config/db');

(async () => {
  try {
    const [rows] = await db.query("SELECT id, status, harga, created_at, check_in FROM bookings WHERE status = 'confirmed'");
    console.table(rows);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
