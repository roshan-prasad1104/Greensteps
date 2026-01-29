const express = require('express');
const { db } = require('../firebase');
const { authenticateToken } = require('../utils/auth');

const router = express.Router();

// Update transport preferences
router.post('/update', authenticateToken, async (req, res) => {
  try {
    const { mode, averageDistance, frequency } = req.body;
    const userId = req.userId;

    const transportRef = db.collection('transport').doc(userId);
    await transportRef.set({
      userId,
      mode,
      averageDistance: parseFloat(averageDistance),
      frequency: parseInt(frequency),
      updatedAt: new Date()
    }, { merge: true });

    res.json({
      message: 'Transport preferences updated',
      transport: { mode, averageDistance, frequency }
    });
  } catch (error) {
    console.error('Transport update error:', error);
    res.status(500).json({ error: 'Failed to update transport' });
  }
});

// Get transport preferences
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const transportDoc = await db.collection('transport').doc(userId).get();
    if (!transportDoc.exists) {
      return res.status(404).json({ error: 'Transport not found' });
    }

    res.json(transportDoc.data());
  } catch (error) {
    console.error('Transport fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch transport' });
  }
});

module.exports = router;
