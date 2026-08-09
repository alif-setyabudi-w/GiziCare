import db from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateOTP, sendOTPEmail } from '../config/email.js';

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validasi input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email dan password harus diisi' });
        }

        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        const user = users[0];

        // Cek apakah email sudah terverifikasi
        if (!user.is_verified) {
            return res.status(403).json({ 
                message: 'Email belum terverifikasi. Silahkan check email Anda untuk kode OTP',
                requireVerification: true 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: 'Password salah' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login berhasil',
            token,
            user: {
                id: user.id,
                nama: user.nama,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

/**
 * Step 1: Register - Generate dan kirim OTP ke email
 */
export const register = async (req, res) => {
    const { nama, email, password } = req.body;
    const role = 'pasien';

    try {
        // Validasi input
        if (!nama || !email || !password) {
            return res.status(400).json({ message: 'Nama, email, dan password harus diisi' });
        }

        // Validasi format email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Format email tidak valid' });
        }

        // Validasi panjang password (minimum 6 karakter)
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password minimal 6 karakter' });
        }

        // Cek duplikasi email - termasuk yang belum verified
        const [existingEmails] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingEmails.length > 0) {
            const user = existingEmails[0];
            if (user.is_verified) {
                return res.status(400).json({ message: 'Email sudah terdaftar' });
            } else {
                // Jika email sudah ada tapi belum verified, hapus dan buat baru
                await db.query('DELETE FROM users WHERE email = ?', [email]);
            }
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate OTP
        const otp = generateOTP();
        const otpExpiredAt = new Date(Date.now() + 10 * 60 * 1000); // Berlaku 10 menit

        // Insert user dengan status belum verified
        const [result] = await db.query(
            'INSERT INTO users (nama, email, password_hash, role, otp_code, otp_expires_at, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [nama, email, hashedPassword, role, otp, otpExpiredAt, false]
        );

        // Kirim OTP ke email
        try {
            await sendOTPEmail(email, otp);
        } catch (emailError) {
            console.error('Error sending email:', emailError);
            // Hapus user yang baru dibuat jika gagal kirim email
            await db.query('DELETE FROM users WHERE id = ?', [result.insertId]);
            return res.status(500).json({ 
                message: 'Gagal mengirim OTP ke email. Silahkan coba lagi.',
                error: emailError.message 
            });
        }

        res.status(201).json({
            message: 'Registrasi berhasil. Silahkan verifikasi email Anda dengan kode OTP yang telah dikirim',
            email: email,
            requiresOTPVerification: true
        });

    } catch (error) {
        console.error('Error in register:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
    }
};

/**
 * Step 2: Verify OTP - Aktifkan akun pengguna
 */
export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Validasi input
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email dan OTP harus diisi' });
        }

        // Cari user berdasarkan email
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        const user = users[0];

        // Cek apakah sudah terverifikasi
        if (user.is_verified) {
            return res.status(400).json({ message: 'Email sudah terverifikasi' });
        }

        // Cek OTP
        if (user.otp_code !== otp) {
            return res.status(400).json({ message: 'Kode OTP tidak valid' });
        }

        // Cek apakah OTP sudah expired
        if (new Date() > new Date(user.otp_expires_at)) {
            return res.status(400).json({ message: 'Kode OTP sudah expired. Silahkan request OTP baru' });
        }

        // Update user - set verified dan clear OTP
        await db.query(
            'UPDATE users SET is_verified = TRUE, otp_code = NULL, otp_expires_at = NULL WHERE id = ?',
            [user.id]
        );

        res.json({
            message: 'Email berhasil diverifikasi. Anda sekarang bisa login',
            user: {
                id: user.id,
                nama: user.nama,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Error in verifyOTP:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
    }
};

/**
 * Resend OTP - Kirim ulang kode OTP ke email
 */
export const resendOTP = async (req, res) => {
    const { email } = req.body;

    try {
        // Validasi input
        if (!email) {
            return res.status(400).json({ message: 'Email harus diisi' });
        }

        // Cari user
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        const user = users[0];

        // Cek apakah sudah terverifikasi
        if (user.is_verified) {
            return res.status(400).json({ message: 'Email sudah terverifikasi' });
        }

        // Generate OTP baru
        const otp = generateOTP();
        const otpExpiredAt = new Date(Date.now() + 10 * 60 * 1000); // Berlaku 10 menit

        // Update OTP di database
        await db.query(
            'UPDATE users SET otp_code = ?, otp_expires_at = ? WHERE id = ?',
            [otp, otpExpiredAt, user.id]
        );

        // Kirim OTP ke email
        try {
            await sendOTPEmail(email, otp);
        } catch (emailError) {
            console.error('Error sending email:', emailError);
            return res.status(500).json({ 
                message: 'Gagal mengirim ulang OTP ke email',
                error: emailError.message 
            });
        }

        res.json({
            message: 'Kode OTP baru telah dikirim ke email Anda',
            email: email
        });

    } catch (error) {
        console.error('Error in resendOTP:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
    }
};

// Logout
export const logout = async (req, res) => {
    res.json({ message: 'Logout berhasil' });
};