/**
 * GeneTrace API Server
 * Express + MongoDB backend for the DNA pattern search platform.
 */
require('dotenv').config();

const express  = require('express');
const cors     = require('cors');
const helmet   = require('helmet');
const morgan   = require('morgan');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

const authRoutes      = require('./routes/auth');
const searchRoutes    = require('./routes/search');
const mutationRoutes  = require('./routes/mutation');
const compareRoutes   = require('./routes/compare');
const historyRoutes   = require('./routes/history');
const analyticsRoutes = require('./routes/analytics');

const app = express();

// ---------- Middleware ----------
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

// Basic rate limiting
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
}));

// ---------- Health ----------
app.get('/', (req, res) => res.json({
  name: 'GeneTrace API',
  status: 'operational',
  version: '1.0.0',
}));

// ---------- Routes ----------
app.use('/api/auth',      authRoutes);
app.use('/api/search',    searchRoutes);
app.use('/api/mutation',  mutationRoutes);
app.use('/api/compare',   compareRoutes);
app.use('/api/history',   historyRoutes);
app.use('/api/analytics', analyticsRoutes);

// ---------- 404 ----------
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// ---------- Error handler ----------
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

// ---------- Start ----------
const PORT = process.env.PORT || 5000;

async function start() {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('✓ MongoDB connected');
    } else {
      console.warn('⚠ MONGO_URI not set — running without database (read-only mode).');
    }
    app.listen(PORT, () => console.log(`✓ GeneTrace API listening on port ${PORT}`));
  } catch (err) {
    console.error('✗ Failed to start server:', err);
    process.exit(1);
  }
}

start();

module.exports = app;
