import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { seedData } from './db/seed.js';
import { startScheduler } from './services/scheduler.js';

// Route handlers
import authRoutes from './routes/auth.js';
import productsRoutes from './routes/products.js';
import rentalsRoutes from './routes/rentals.js';
import ordersRoutes from './routes/orders.js';
import paymentsRoutes from './routes/payments.js';
import quotesRoutes from './routes/quotes.js';
import inquiriesRoutes from './routes/inquiries.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initialize & Seed Database automatically
seedData();

// Health check endpoint (NFR-003, Phase 3)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'bolddee-api',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/rentals', rentalsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/quotes', quotesRoutes);
app.use('/api/inquiries', inquiriesRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 BOLDDEE Backend API running on http://localhost:${PORT}`);
});

export default app;
