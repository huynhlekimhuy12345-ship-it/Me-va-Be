import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import { initSchema } from './db/database.js';
import publicRoutes from './routes/publicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');
const uploadsDir = path.resolve(__dirname, '../uploads');
const clientDistDir = path.resolve(rootDir, 'client/dist');

// Initialize database schema
initSchema();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for local dev
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Static uploads directory
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Anti-spam Rate Limiter on placing orders
const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // max 20 orders per IP per 15 minutes
  message: {
    ok: false,
    error: 'Bạn đã thao tác đặt hàng quá nhanh. Vui lòng thử lại sau vài phút!',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Mount Routes
app.use('/api/orders', orderLimiter);
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ ok: true, status: 'healthy', time: new Date().toISOString() });
});

// Serve frontend build in production mode
if (fs.existsSync(clientDistDir)) {
  console.log(`[Server] Serving production client from: ${clientDistDir}`);
  app.use(express.static(clientDistDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDistDir, 'index.html'));
  });
}

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('[Error Handler]', err);
  const status = err.status || 400;
  res.status(status).json({
    ok: false,
    error: err.message || 'Đã xảy ra lỗi máy chủ, vui lòng thử lại sau.',
  });
});

app.listen(PORT, () => {
  console.log(`🌸 Nga Pijama Server đang chạy tại http://localhost:${PORT}`);
});

export default app;
