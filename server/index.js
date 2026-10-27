const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const employeeRoutes = require('./routes/employeeRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const announcementRoutes = require('./routes/announcementRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────────────────────
const clientUrl = process.env.CLIENT_URL;

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server health checks)
      if (!origin) return callback(null, true);
      if (
        !clientUrl ||
        clientUrl === '*' ||
        origin === clientUrl ||
        origin.endsWith('.vercel.app') ||
        origin.startsWith('http://localhost:')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());

// ── Root & Health Routes ────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    name: 'StaffSync HRMS API',
    status: 'Running',
    health: '/api/health',
    endpoints: {
      employees: '/api/employees',
      attendance: '/api/attendance',
      leaves: '/api/leaves',
      announcements: '/api/announcements',
    },
  });
});

app.get('/api/health', (req, res) => {
  const dbStates = { 0: 'Disconnected', 1: 'Connected', 2: 'Connecting', 3: 'Disconnecting' };
  res.json({
    status: 'OK',
    message: 'StaffSync API is running',
    dbStatus: dbStates[mongoose.connection.readyState] || 'Unknown',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/announcements', announcementRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ── Start Server ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📋 Health: /api/health`);
});

// ── Connect MongoDB ─────────────────────────────────────────────────────────
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI environment variable is missing.');
  console.error('   Please set MONGO_URI in your deployment environment or server/.env');
} else {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => {
      console.error('❌ MongoDB connection failed:', err.message);
      console.error('   Verify your MONGO_URI string and Atlas Network Access (0.0.0.0/0) in Atlas.');
    });
}
