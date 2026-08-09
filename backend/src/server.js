import "dotenv/config.js";
import app from "./app.js"; // trigger nodemon restart

// Validasi environment variables wajib sebelum server jalan
if (!process.env.JWT_SECRET) {
  console.error('❌ FATAL: JWT_SECRET tidak di-set di .env. Server tidak akan berjalan.');
  process.exit(1);
}
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
  console.error('❌ FATAL: Konfigurasi database (DB_HOST/DB_USER/DB_NAME) belum lengkap.');
  process.exit(1);
}

const PORT = process.env.PORT || 5000;
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:5001";

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  console.log(`ML Service URL: ${ML_SERVICE_URL}`);
});