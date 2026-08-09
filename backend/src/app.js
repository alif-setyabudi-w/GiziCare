import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/db.js'; // Import agar koneksi dicek

// Import Routes
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import petugasRoutes from './routes/gizi.routes.js'; // Sesuaikan nama route Anda
import rekomendasiRoutes from './routes/rekomendasi.routes.js';
import konsultasiRoutes from './routes/konsultasi.routes.js';
import konsumsiRoutes from './routes/konsumsi.routes.js';

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['https://gizicare.netlify.app'];

app.use(cors({
  origin: (origin, callback) => {
    // Izinkan request tanpa origin (Postman, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/gizi', petugasRoutes);
app.use('/api/rekomendasi', rekomendasiRoutes);
app.use('/api/konsultasi', konsultasiRoutes);
app.use('/api/konsumsi', konsumsiRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('API GiziCare Ready!');
});

export default app;