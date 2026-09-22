const mysql = require('mysql2/promise');

// Crie a pool de conexões com os dados do seu banco MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'BookCeep@',
  database: 'Book_Ceep',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
