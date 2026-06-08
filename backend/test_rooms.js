require('dotenv').config();
const db = require('./config/db');

async function test() {
  const today = new Date().toISOString().split('T')[0];
  console.log('Today:', today);

  // Check rooms with availability
  const [rooms] = await db.query(`
    SELECT r.id, r.name,
      CASE WHEN (
        SELECT COUNT(*) FROM bookings b
        WHERE b.room_id = r.id
          AND b.status != 'cancelled'
          AND b.check_in <= ? AND b.check_out > ?
      ) = 0 THEN 1 ELSE 0 END AS is_available
    FROM rooms r WHERE r.is_active = true
  `, [today, today]);
  console.log('\nRooms with availability:', JSON.stringify(rooms, null, 2));

  // Check confirmed bookings
  const [bookings] = await db.query(
    'SELECT id, room_id, status, check_in, check_out FROM bookings WHERE status = ? LIMIT 10',
    ['confirmed']
  );
  console.log('\nConfirmed bookings:', JSON.stringify(bookings, null, 2));

  // Check all bookings with room_id
  const [allBookings] = await db.query(
    'SELECT id, room_id, status, check_in, check_out FROM bookings ORDER BY id DESC LIMIT 10'
  );
  console.log('\nAll bookings (latest 10):', JSON.stringify(allBookings, null, 2));

  process.exit(0);
}

test().catch(err => {
  console.error(err);
  process.exit(1);
});
