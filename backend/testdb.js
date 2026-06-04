const mysql = require('mysql2/promise');
(async () => {
  try {
    const conn = await mysql.createConnection({ host: '127.0.0.1', user: 'root', password: '', port: 3306 });
    const [rows] = await conn.query('SHOW DATABASES');
    console.log(JSON.stringify(rows, null, 2));
    await conn.end();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
