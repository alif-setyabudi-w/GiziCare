import express from "express";
import { login, register, verifyOTP, resendOTP, logout } from "../controllers/auth.controller.js";
import { loginLimiter, registerLimiter, otpLimiter, resendOTPLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

// Authentication routes dengan rate limiting
router.post("/login", loginLimiter, login);
router.post("/register", registerLimiter, register);
router.post("/verify-otp", otpLimiter, verifyOTP);
router.post("/resend-otp", resendOTPLimiter, resendOTP);
router.post("/logout", logout);

export default router;
