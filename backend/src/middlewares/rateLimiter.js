// Rate Limiting untuk OTP - Cegah brute force attacks
// Gunakan memory store untuk development, Redis untuk production

import rateLimit from 'express-rate-limit';

/**
 * Rate limiter untuk OTP requests
 * Max 3 attempts per 15 menit
 */
export const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 3, // limit 3 requests per windowMs
    message: 'Terlalu banyak percobaan OTP. Coba lagi dalam 15 menit',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Skip rate limiting jika NODE_ENV=development (optional)
        return process.env.NODE_ENV === 'development';
    },
    keyGenerator: (req) => {
        // Rate limit berdasarkan email, bukan IP
        return req.body.email || req.ip;
    }
});

/**
 * Rate limiter untuk resend OTP
 * Max 5 attempts per jam
 */
export const resendOTPLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 jam
    max: 5, // limit 5 resend per jam
    message: 'Terlalu banyak resend OTP. Coba lagi nanti',
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.body.email || req.ip;
    }
});

/**
 * Rate limiter untuk login
 * Max 10 attempts per 15 menit
 */
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Terlalu banyak login gagal. Coba lagi dalam 15 menit',
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.body.email || req.ip;
    }
});

/**
 * Rate limiter untuk register
 * Max 5 registrasi baru per hari per IP
 */
export const registerLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 jam
    max: 5,
    message: 'Terlalu banyak registrasi dari IP ini. Coba lagi besok',
    standardHeaders: true,
    legacyHeaders: false
});

export default {
    otpLimiter,
    resendOTPLimiter,
    loginLimiter,
    registerLimiter
};
