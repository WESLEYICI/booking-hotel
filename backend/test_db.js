const db = require('./config/db');

async function test() {
  try {
    const [rows] = await db.query('DESCRIBE bookings;');
    console.log(rows);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
test();
