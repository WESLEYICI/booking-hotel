// server.js
const app = require('./app');
const db = require('./config/db');
const PORT = process.env.PORT || 5000;

async function prepareDatabase() {
  try {
    const [statusColumnRows] = await db.query(
      `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS \
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'status'`
    );
    if (statusColumnRows[0].cnt === 0) {
      await db.query(`ALTER TABLE bookings ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'pending' AFTER harga`);
      console.log('Added status column to bookings table.');
    } else {
      console.log('status column already exists.');
    }

    const [paymentProofRows] = await db.query(
      `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS \
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'payment_proof'`
    );
    if (paymentProofRows[0].cnt === 0) {
      await db.query(`ALTER TABLE bookings ADD COLUMN payment_proof VARCHAR(255) DEFAULT NULL AFTER harga`);
      console.log('Added payment_proof column to bookings table.');
    } else {
      console.log('payment_proof column already exists.');
    }

    const [paymentTableRows] = await db.query(
      `SELECT COUNT(*) AS cnt FROM information_schema.TABLES \
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'payments'`
    );
    if (paymentTableRows[0].cnt === 0) {
      await db.query(
        `CREATE TABLE payments (
          id INT NOT NULL AUTO_INCREMENT,
          booking_id INT NOT NULL,
          order_id VARCHAR(100) NOT NULL,
          gross_amount DECIMAL(12,2) NOT NULL,
          transaction_status VARCHAR(50) NOT NULL DEFAULT 'pending',
          payment_type VARCHAR(50) DEFAULT NULL,
          transaction_time DATETIME DEFAULT NULL,
          snap_token VARCHAR(255) DEFAULT NULL,
          redirect_url VARCHAR(512) DEFAULT NULL,
          created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          UNIQUE KEY order_id (order_id),
          KEY fk_payments_booking (booking_id),
          CONSTRAINT fk_payments_booking FOREIGN KEY (booking_id) REFERENCES bookings (id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `
      );
      console.log('Created payments table.');
    } else {
      console.log('payments table already exists.');
      const [snapTokenColumnRows] = await db.query(
        `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS \
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'payments' AND COLUMN_NAME = 'snap_token'`
      );
      if (snapTokenColumnRows[0].cnt === 0) {
        await db.query(`ALTER TABLE payments ADD COLUMN snap_token VARCHAR(255) DEFAULT NULL AFTER transaction_time`);
        console.log('Added snap_token column to payments table.');
      }
      const [redirectUrlColumnRows] = await db.query(
        `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS \
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'payments' AND COLUMN_NAME = 'redirect_url'`
      );
      if (redirectUrlColumnRows[0].cnt === 0) {
        await db.query(`ALTER TABLE payments ADD COLUMN redirect_url VARCHAR(512) DEFAULT NULL AFTER snap_token`);
        console.log('Added redirect_url column to payments table.');
      }
    }
  } catch (err) {
    console.error('Database preparation failed:', err.message || err);
  }
}

prepareDatabase().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
});
