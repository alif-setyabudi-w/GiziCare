import db from './src/config/db.js';
import bcrypt from 'bcrypt';

const createPetugas = async () => {
    const email = 'petugas@gmail.com';
    const password = 'petugas54321'; // Password yang Anda inginkan

    try {
        // 1. Hapus user lama jika ada
        await db.query("DELETE FROM users WHERE email = ?", [email]);

        // 2. Buat Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Masukkan ke Database dengan is_verified = TRUE (agar langsung bisa login)
        await db.query(
            "INSERT INTO users (nama, email, password_hash, role, otp_code, otp_expires_at, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?)",
            ['Ahli Gizi Utama', email, hashedPassword, 'ahli_gizi', null, null, true]
        );

        console.log("✅ AKUN BERHASIL DIBUAT!");
        console.log("📧 Email: " + email);
        console.log("🔑 Pass : " + password);
        console.log("✔️  Status: Email sudah verified - bisa login langsung!");

    } catch (error) {
        console.error("❌ Gagal:", error);
    } finally {
        process.exit();
    }
};

createPetugas();