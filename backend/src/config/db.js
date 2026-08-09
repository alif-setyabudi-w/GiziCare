import mysql from 'mysql2';
import dotenv from 'dotenv';

// Memuat variabel dari file .env
dotenv.config();

// Membuat connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // minimal dulu
  queueLimit: 0,
  connectTimeout: 30000,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0
});

/*DB UNTUK LOCALHOST */
/* const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}); */

// Cek koneksi saat aplikasi berjalan
db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database Connection Failed:', err.code);
        console.error('Pesan Error:', err.message);
    } else {
        console.log('✅ Database Connected successfully to:', process.env.DB_NAME);
        connection.release();
    }
});

// Export menggunakan promise agar bisa pakai async/await di controller
export default db.promise();