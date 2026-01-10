require('dotenv').config(); // load .env

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./src/routes/auth');
const habitRoutes = require('./src/routes/habits');
const moneyRoutes = require('./src/routes/money');

const app = express();

// =========================
// MIDDLEWARES
// =========================
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// =========================
// ROUTES
// =========================
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/money', moneyRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Ultimate Tracker API running' });
});

// =========================
// VALIDATE ENV
// =========================
const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI is not set. Please create a .env file in the backend folder with MONGO_URI and PORT.');
  process.exit(1);
}

// =========================
// CONNECT DB & START SERVER
// =========================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });
