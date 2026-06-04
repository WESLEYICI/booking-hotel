// server.js
const app = require('./app');
const db = require('./config/db');
const PORT = process.env.PORT || 5000;

async function prepareDatabase() {
  try {
    // 1. Create rooms table if not exists
    const [roomsTableRows] = await db.query(
      `SELECT COUNT(*) AS cnt FROM information_schema.TABLES \
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'rooms'`
    );
    if (roomsTableRows[0].cnt === 0) {
      await db.query(
        `CREATE TABLE rooms (
          id INT NOT NULL AUTO_INCREMENT,
          name VARCHAR(255) NOT NULL,
          price DECIMAL(12,2) NOT NULL,
          capacity INT NOT NULL DEFAULT 1,
          size VARCHAR(50) DEFAULT NULL,
          facility VARCHAR(100) DEFAULT NULL,
          description TEXT DEFAULT NULL,
          amenities TEXT DEFAULT NULL,
          image_url VARCHAR(512) DEFAULT NULL,
          image_url_2 VARCHAR(512) DEFAULT NULL,
          created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
      );
      console.log('Created rooms table.');

      // Insert default rooms
      await db.query(`
        INSERT INTO rooms (name, price, capacity, size, facility, description, amenities, image_url, image_url_2) VALUES
        ('Classic Double Room', 150000, 2, '30 M', 'beach', 'Let yourself fully relax in our luxurious favorable accommodations with lots of facilities and high-level service.', 'Bathroom essentials, Bedroom comforts, Free parking, Hair dryer, Heating, Terrace, Wi-Fi', 'https://themes.getmotopress.com/albatross/wp-content/uploads/sites/37/2020/11/standard-single-room-920x650.jpg', 'https://themes.getmotopress.com/albatross/wp-content/uploads/sites/37/2020/11/comfort-triple-room-920x650.jpg'),
        ('Comfort Triple Room', 250000, 3, '40 M', 'beach', 'Let yourself fully relax in our luxurious favorable accommodations with lots of facilities and high-level service.', 'Bathroom essentials, Bedroom comforts, Free parking, Hair dryer, Heating, Terrace, Wi-Fi', 'https://themes.getmotopress.com/albatross/wp-content/uploads/sites/37/2020/11/comfort-triple-room-920x650.jpg', 'https://themes.getmotopress.com/albatross/wp-content/uploads/sites/37/2020/11/comfort-triple-room2-920x650.jpg'),
        ('Standard Single Room', 100000, 1, '25 M', 'Swiming Pool', 'Standard Single room is available with either double or single beds. Designed in an open-concept living area.', 'Bathroom essentials, Bedroom comforts, Free parking, Hair dryer, Heating, Terrace, Wi-Fi', 'https://themes.getmotopress.com/albatross/wp-content/uploads/sites/37/2020/11/standard-single-room2-1536x1094.jpg', 'https://themes.getmotopress.com/albatross/wp-content/uploads/sites/37/2020/11/standard-single-room-920x650.jpg'),
        ('Superior Double Room', 200000, 2, '40 M', 'Seaside', 'Your perfect choice for staying in a big city, where you can come and fully relax after an eventful day.', 'Bathroom essentials, Bedroom comforts, Free parking, Hair dryer, Heating, Terrace, Wi-Fi', 'https://themes.getmotopress.com/albatross/wp-content/uploads/sites/37/2020/11/superior-double-room2-1536x1094.jpg', 'https://themes.getmotopress.com/albatross/wp-content/uploads/sites/37/2020/11/superior-double-room-920x650.jpg'),
        ('Mountain View Suite', 250000, 4, '35 M', 'beach', 'Let yourself fully relax in our luxurious favorable accommodations with lots of facilities.', 'Bathroom essentials, Bedroom comforts, Free parking, Hair dryer, Heating, Terrace, Wi-Fi', 'https://themes.getmotopress.com/albatross/wp-content/uploads/sites/37/2020/11/classic-double-room-920x650.jpg', 'https://themes.getmotopress.com/albatross/wp-content/uploads/sites/37/2020/11/standard-single-room-920x650.jpg')
      `);
      console.log('Inserted default rooms.');
    } else {
      console.log('rooms table already exists.');
    }

    // Check for is_active column in rooms
    const [isActiveColumnRows] = await db.query(
      `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS \
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'rooms' AND COLUMN_NAME = 'is_active'`
    );
    if (isActiveColumnRows[0].cnt === 0) {
      await db.query(`ALTER TABLE rooms ADD COLUMN is_active BOOLEAN DEFAULT true`);
      console.log('Added is_active column to rooms table.');
    } else {
      console.log('is_active column already exists.');
    }

    // 2. Add room_id to bookings table if not exists
    const [roomIdColumnRows] = await db.query(
      `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS \
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'room_id'`
    );
    if (roomIdColumnRows[0].cnt === 0) {
      await db.query(`ALTER TABLE bookings ADD COLUMN room_id INT DEFAULT NULL AFTER user_id`);
      console.log('Added room_id column to bookings table.');
    } else {
      console.log('room_id column already exists.');
    }

    // existing alterations...
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
