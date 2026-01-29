const express = require('express');
const { db } = require('../firebase');
const { authenticateToken } = require('../utils/auth');
const { calculateEmissions, calculatePoints, getStreakBonus } = require('../utils/emissions');
const moment = require('moment');

const router = express.Router();

// Add daily transport record
router.post('/daily', authenticateToken, async (req, res) => {
  try {
    const { mode, distance, trips } = req.body;
    const userId = req.userId;

    if (!mode || !distance) {
      return res.status(400).json({ error: 'Mode and distance required' });
    }

    const emissions = calculateEmissions(mode, distance);
    const points = calculatePoints(mode, distance);
    const today = moment().format('YYYY-MM-DD');

    // Get user document
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userDoc.data();

    // Create daily record
    const dailyRecord = {
      date: today,
      mode,
      distance: parseFloat(distance),
      trips: trips || 1,
      emissions: emissions,
      points: points,
      createdAt: new Date()
    };

    // Update user's totals
    await db.collection('users').doc(userId).update({
      totalEmissions: (user.totalEmissions || 0) + emissions,
      totalDistance: (user.totalDistance || 0) + parseFloat(distance),
      totalPoints: (user.totalPoints || 0) + points
    });

    // Save daily record
    const recordRef = db.collection('dailyRecords').doc(userId);
    const recordDoc = await recordRef.get();

    if (recordDoc.exists) {
      const records = recordDoc.data().records || [];
      const existingRecordIndex = records.findIndex(r => r.date === today && r.mode === mode);

      if (existingRecordIndex > -1 && trips === 0) {
        // Update existing record (incremental tracking)
        records[existingRecordIndex].distance += parseFloat(distance);
        records[existingRecordIndex].emissions += emissions;
        records[existingRecordIndex].points += points;
        records[existingRecordIndex].updatedAt = new Date();
        await recordRef.update({ records });
      } else {
        // Add new record or new trip
        await recordRef.update({
          records: [...records, dailyRecord]
        });
      }
    } else {
      await recordRef.set({
        userId,
        records: [dailyRecord]
      });
    }

    res.json({
      message: 'Daily record added',
      record: dailyRecord,
      userStats: {
        totalPoints: (user.totalPoints || 0) + points,
        totalEmissions: (user.totalEmissions || 0) + emissions,
        totalDistance: (user.totalDistance || 0) + parseFloat(distance)
      }
    });
  } catch (error) {
    console.error('Daily record error:', error);
    res.status(500).json({ error: 'Failed to add daily record' });
  }
});

// Get dashboard data
router.get('/dashboard/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('[DASHBOARD] Fetching dashboard for userId:', userId);

    // Get user profile
    const userDoc = await db.collection('users').doc(userId).get();
    console.log('[DASHBOARD] User doc exists:', userDoc.exists);

    if (!userDoc.exists) {
      console.log('[DASHBOARD] User not found:', userId);
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userDoc.data();
    console.log('[DASHBOARD] User data retrieved:', user.email);

    // Get daily records - safely handle missing data
    let records = [];
    try {
      const recordsDoc = await db.collection('dailyRecords').doc(userId).get();
      console.log('[DASHBOARD] Records doc exists:', recordsDoc.exists);
      if (recordsDoc.exists) {
        const data = recordsDoc.data();
        records = Array.isArray(data.records) ? data.records : [];
        console.log('[DASHBOARD] Records count:', records.length);
      }
    } catch (e) {
      console.log('[DASHBOARD] Could not fetch records:', e.message);
      records = [];
    }

    // Calculate today's stats
    const today = moment().format('YYYY-MM-DD');
    const todayRecord = records.find(r => r.date === today);

    // Calculate streak
    let streak = 0;
    let currentDate = moment();
    for (let i = 0; i < 365; i++) {
      const dateStr = currentDate.format('YYYY-MM-DD');
      if (records.find(r => r.date === dateStr)) {
        streak++;
        currentDate.subtract(1, 'day');
      } else {
        break;
      }
    }

    // Calculate weekly and monthly emissions
    const weeklyEmissions = records
      .filter(r => moment(r.date).isAfter(moment().subtract(7, 'days')))
      .reduce((sum, r) => sum + (r.emissions || 0), 0);

    const monthlyEmissions = records
      .filter(r => moment(r.date).isAfter(moment().subtract(30, 'days')))
      .reduce((sum, r) => sum + (r.emissions || 0), 0);

    // Get streak bonus
    const streakBonus = getStreakBonus(streak);

    const response = {
      profile: {
        name: user.name,
        email: user.email,
        department: user.department,
        campus: user.campus,
        totalPoints: user.totalPoints || 0,
        totalEmissions: user.totalEmissions || 0,
        totalDistance: user.totalDistance || 0
      },
      todayStats: {
        mode: todayRecord?.mode || 'Not recorded',
        distance: todayRecord?.distance || 0,
        emissions: todayRecord?.emissions || 0,
        points: todayRecord?.points || 0,
        trips: todayRecord?.trips || 0
      },
      weeklyEmissions: parseFloat(weeklyEmissions.toFixed(4)),
      monthlyEmissions: parseFloat(monthlyEmissions.toFixed(4)),
      streak: {
        days: streak,
        bonus: streakBonus
      },
      records: records.slice(-30) // Last 30 records
    };

    console.log('[DASHBOARD] Returning dashboard data successfully');
    res.json(response);
  } catch (error) {
    console.error('[DASHBOARD] Error:', error.message, error.stack);
    res.status(500).json({
      error: 'Failed to fetch dashboard data',
      details: error.message
    });
  }
});

// Get emissions history (for charts)
router.get('/emissions-history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { period = 'week' } = req.query; // week, month, year

    const recordsDoc = await db.collection('dailyRecords').doc(userId).get();
    const records = recordsDoc.exists ? recordsDoc.data().records || [] : [];

    let daysBack = 7;
    if (period === 'month') daysBack = 30;
    if (period === 'year') daysBack = 365;

    const filtered = records.filter(r =>
      moment(r.date).isAfter(moment().subtract(daysBack, 'days'))
    );

    const chartData = {};
    for (let i = daysBack - 1; i >= 0; i--) {
      const date = moment().subtract(i, 'days').format('YYYY-MM-DD');
      const record = filtered.find(r => r.date === date);
      chartData[date] = {
        emissions: record?.emissions || 0,
        points: record?.points || 0,
        distance: record?.distance || 0
      };
    }

    res.json(chartData);
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

module.exports = router;
