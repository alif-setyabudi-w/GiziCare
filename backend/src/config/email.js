import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Konfigurasi Nodemailer - Aman untuk Railway
// Gunakan environment variables untuk credential

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true' || false, // true untuk 465, false untuk 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    // Tambahan untuk Railway
    connectionUrl: process.env.EMAIL_CONNECTION_URL // Alternative: gunakan connection URL jika diperlukan
});

// Verifikasi konfigurasi saat aplikasi startup
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Email Configuration Error:', error.message);
        console.error('Pastikan EMAIL_USER dan EMAIL_PASSWORD sudah di-set di .env atau Railway variables');
    } else {
        console.log('✅ Email Service Ready');
    }
});

/**
 * Generate OTP 6 digit random
 */
export const generateOTP = () => {
    // Generate a secure 6‑digit numeric OTP using crypto.randomInt
    // crypto.randomInt(min, max) returns an integer in [min, max)
    // We want 100000‑999999 inclusive, so use max = 1000000
    const otp = crypto.randomInt(100000, 1000000);
    return otp.toString();
};

/**
 * Kirim OTP ke email pengguna - Fire & Forget (Async)
 * Tidak menunggu email terkirim, langsung return response
 */
export const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: email,
        subject: 'Kode OTP Registrasi - Aplikasi GiziCare',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; }
                    .content { background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                    .header { color: #333; margin-bottom: 20px; }
                    .otp-box { background-color: #e8f4f8; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0; }
                    .otp-code { font-size: 32px; font-weight: bold; color: #2196F3; letter-spacing: 5px; }
                    .footer { color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px; }
                    .warning { color: #d32f2f; font-size: 12px; margin-top: 10px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="content">
                        <h1 class="header">Verifikasi Email Anda</h1>
                        <p>Hallo,</p>
                        <p>Terima kasih telah mendaftar di Aplikasi GiziCare. Untuk menyelesaikan pendaftaran Anda, gunakan kode OTP di bawah ini:</p>
                        
                        <div class="otp-box">
                            <div class="otp-code">${otp}</div>
                        </div>
                        
                        <p><strong>Penting:</strong></p>
                        <ul>
                            <li>Kode OTP berlaku selama 10 menit</li>
                            <li>Jangan bagikan kode ini kepada siapapun</li>
                            <li>Jika Anda tidak melakukan pendaftaran, abaikan email ini</li>
                        </ul>
                        
                        <div class="footer">
                            <p>Email ini dikirim otomatis. Jangan balas email ini.</p>
                            <p>© 2026 Aplikasi GiziCare. Semua hak dilindungi.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `,
        // Plain text alternative
        text: `Kode OTP Anda: ${otp}\n\nKode berlaku selama 10 menit. Jangan bagikan kode ini kepada siapapun.`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ OTP Email sent to', email, ':', info.response);
        return { success: true, message: 'OTP berhasil dikirim ke email' };
    } catch (error) {
        console.error('❌ Error sending OTP email to', email, ':', error.message);
        throw error;
    }
};

/**
 * Verifikasi email untuk reset password - Fire & Forget (Async)
 * Tidak menunggu email terkirim, langsung return response
 */
export const sendVerificationEmail = async (email, token) => {
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
    const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: email,
        subject: 'Verifikasi Email - Aplikasi GiziCare',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; }
                    .content { background-color: #ffffff; padding: 30px; border-radius: 8px; }
                    .button { background-color: #2196F3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="content">
                        <h1>Verifikasi Email Anda</h1>
                        <p>Klik link di bawah untuk memverifikasi email Anda:</p>
                        <a href="${verificationLink}" class="button">Verifikasi Email</a>
                        <p>Link berlaku selama 24 jam</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Verification Email sent to', email, ':', info.response);
        return { success: true, message: 'Email verifikasi berhasil dikirim' };
    } catch (error) {
        console.error('❌ Error sending verification email to', email, ':', error.message);
        throw error;
    }
};

export default transporter;
