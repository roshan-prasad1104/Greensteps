const express = require('express');
const { db } = require('../firebase');

const router = express.Router();

// Helper to get all users from the database
const getAllUsers = () => {
  try {
    const usersCollection = db.collection('users').data;
    const users = [];
    if (usersCollection && usersCollection instanceof Map) {
      for (const [id, userData] of usersCollection) {
        users.push({ id, ...userData });
      }
    }
    return users;
  } catch (e) {
    console.error('Error getting users:', e.message);
    return [];
  }
};

// Get department leaderboard
router.get('/department/:department', async (req, res) => {
  try {
    const { department } = req.params;
    console.log('[LEADERBOARD] Fetching', department, 'users');

    const allUsers = getAllUsers();
    console.log('[LEADERBOARD] Total users in DB:', allUsers.length);

    const leaderboard = allUsers
      .filter(user => user.department === department)
      .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0))
      .slice(0, 100)
      .map((user, index) => ({
        rank: index + 1,
        name: user.name,
        email: user.email,
        totalPoints: user.totalPoints || 0,
        totalEmissions: user.totalEmissions || 0,
        totalDistance: user.totalDistance || 0
      }));

    console.log('[LEADERBOARD] Returning', leaderboard.length, 'users for', department);
    res.json(leaderboard);
  } catch (error) {
    console.error('[LEADERBOARD] Department error:', error.message);
    res.status(500).json({ error: 'Failed to fetch leaderboard', details: error.message });
  }
});

// Get campus leaderboard
router.get('/campus/:campus', async (req, res) => {
  try {
    const { campus } = req.params;
    console.log('[LEADERBOARD] Fetching campus:', campus);

    const allUsers = getAllUsers();

    const leaderboard = allUsers
      .filter(user => user.campus === campus)
      .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0))
      .slice(0, 100)
      .map((user, index) => ({
        rank: index + 1,
        name: user.name,
        department: user.department,
        totalPoints: user.totalPoints || 0,
        totalEmissions: user.totalEmissions || 0,
        totalDistance: user.totalDistance || 0
      }));

    console.log('[LEADERBOARD] Returning', leaderboard.length, 'users for campus:', campus);
    res.json(leaderboard);
  } catch (error) {
    console.error('[LEADERBOARD] Campus error:', error.message);
    res.status(500).json({ error: 'Failed to fetch campus leaderboard', details: error.message });
  }
});

// Get user's rank
router.get('/rank/:userId/:department/:campus', async (req, res) => {
  try {
    const { userId, department, campus } = req.params;
    console.log('[RANK] Fetching rank for:', userId, 'in', department, campus);

    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userPoints = userDoc.data().totalPoints || 0;
    const allUsers = getAllUsers();

    // Rank in department
    const deptUsers = allUsers
      .filter(u => u.department === department)
      .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));

    let deptRank = deptUsers.length + 1;
    deptUsers.forEach((user, index) => {
      if (user.id === userId) {
        deptRank = index + 1;
      }
    });

    // Rank in campus
    const campusUsers = allUsers
      .filter(u => u.campus === campus)
      .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));

    let campusRank = campusUsers.length + 1;
    campusUsers.forEach((user, index) => {
      if (user.id === userId) {
        campusRank = index + 1;
      }
    });

    res.json({
      userPoints,
      departmentRank: deptRank,
      departmentTotal: deptUsers.length,
      campusRank: campusRank,
      campusTotal: campusUsers.length
    });
  } catch (error) {
    console.error('[RANK] Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch rank', details: error.message });
  }
});

// Get averages for department and campus
router.get('/averages/:department/:campus', async (req, res) => {
  try {
    const { department, campus } = req.params;
    console.log('[AVERAGES] Fetching averages for', department, campus);

    const allUsers = getAllUsers();

    // Department Average
    const deptUsers = allUsers.filter(u => u.department === department);
    const deptTotal = deptUsers.reduce((sum, u) => sum + (Number(u.totalEmissions) || 0), 0);
    const deptAvg = deptUsers.length > 0 ? deptTotal / deptUsers.length : 0;

    // Campus Average
    const campusUsers = allUsers.filter(u => u.campus === campus);
    const campusTotal = campusUsers.reduce((sum, u) => sum + (Number(u.totalEmissions) || 0), 0);
    const campusAvg = campusUsers.length > 0 ? campusTotal / campusUsers.length : 0;

    console.log(`[AVERAGES] Dept Avg: ${deptAvg}, Campus Avg: ${campusAvg}`);

    res.json({
      departmentAvg: deptAvg,
      campusAvg: campusAvg
    });
  } catch (error) {
    console.error('[AVERAGES] Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch averages', details: error.message });
  }
});

module.exports = router;
