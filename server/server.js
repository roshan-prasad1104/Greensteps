const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const leaderboardRoutes = require('./routes/leaderboard');
const transportRoutes = require('./routes/transport');
const aiRoutes = require('./routes/ai');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`\n✓ Server running on port ${PORT}`);
    console.log(`✓ API available at http://localhost:${PORT}/api`);
    console.log(`✓ Health check: http://localhost:${PORT}/api/health\n`);
  });
}

module.exports = app;
