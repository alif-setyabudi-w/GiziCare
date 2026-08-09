// Input Validation & Security Utilities

/**
 * Validasi format email
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validasi panjang password
 */
export const isValidPassword = (password) => {
    // Minimal 6 karakter, harus ada kombinasi huruf dan angka (optional untuk simple app)
    return password.length >= 6;
};

/**
 * Validasi format nama
 */
export const isValidName = (nama) => {
    // Minimal 3 karakter, maksimal 100, hanya huruf, angka, spasi dan dash
    const nameRegex = /^[a-zA-Z0-9\s\-]{3,100}$/;
    return nameRegex.test(nama);
};

/**
 * Validasi OTP format (6 digit)
 */
export const isValidOTP = (otp) => {
    const otpRegex = /^\d{6}$/;
    return otpRegex.test(otp);
};

/**
 * Sanitize email untuk logging (hide part of email)
 */
export const sanitizeEmail = (email) => {
    const [localPart, domain] = email.split('@');
    const visibleChars = Math.max(1, Math.floor(localPart.length / 3));
    const sanitized = localPart.substring(0, visibleChars) + '*'.repeat(localPart.length - visibleChars);
    return `${sanitized}@${domain}`;
};

/**
 * Check apakah request dari trusted source (untuk CORS)
 */
export const isTrustedOrigin = (origin) => {
    const trustedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    return trustedOrigins.includes(origin) || process.env.NODE_ENV === 'development';
};

/**
 * Generate random token untuk security
 */
export const generateRandomToken = (length = 32) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
};

/**
 * Error logger dengan sanitization
 */
export const logError = (message, error, email = null) => {
    const timestamp = new Date().toISOString();
    const sanitizedEmail = email ? sanitizeEmail(email) : 'N/A';
    console.error(`[${timestamp}] ${message} | Email: ${sanitizedEmail} | Error: ${error.message}`);
};

export default {
    isValidEmail,
    isValidPassword,
    isValidName,
    isValidOTP,
    sanitizeEmail,
    isTrustedOrigin,
    generateRandomToken,
    logError
};
