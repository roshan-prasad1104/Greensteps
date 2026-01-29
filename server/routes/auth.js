const express = require('express');
const bcrypt = require('bcryptjs');
const { db } = require('../firebase');
const { generateToken } = require('../utils/auth');

const router = express.Router();

// Sign Up
router.post('/signup', async (req, res) => {
  try {
    const { name, email, department, campus, password, transport } = req.body;
    console.log('[AUTH] Signup attempt:', { name, email, department, campus });
    console.log('[AUTH] Request body keys:', Object.keys(req.body));
    console.log('[AUTH] Transport object:', transport);

    // Check if user exists
    const userSnapshot = await db.collection('users').where('email', '==', email).get();
    if (!userSnapshot.empty) {
      console.log('[AUTH] User already exists:', email);
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user document
    const userId = email.split('@')[0] + '_' + Date.now();
    console.log('[AUTH] Creating user with ID:', userId);
    await db.collection('users').doc(userId).set({
      name,
      email,
      department,
      campus,
      password: hashedPassword,
      createdAt: new Date(),
      totalPoints: 0,
      totalEmissions: 0,
      totalDistance: 0
    });
    console.log('[AUTH] User document created successfully');

    // Initialize transport record
    if (transport && transport.mode) {
      console.log('[AUTH] Creating transport record with mode:', transport.mode);
      await db.collection('transport').doc(userId).set({
        userId,
        mode: transport.mode,
        averageDistance: transport.averageDistance || 0,
        frequency: transport.frequency || 0,
        updatedAt: new Date()
      });
      console.log('[AUTH] Transport record created');
    }

    // Initialize empty daily records with proper structure
    await db.collection('dailyRecords').doc(userId).set({
      userId,
      records: []
    });
    console.log('[AUTH] Daily records initialized');

    const token = generateToken(userId);
    console.log('[AUTH] Token generated, returning response with userId:', userId);
    res.status(201).json({
      message: 'User created successfully',
      token,
      userId,
      user: { name, email, department, campus }
    });
  } catch (error) {
    console.error('Signup error:', error.message, error.code);
    res.status(500).json({ 
      error: 'Signup failed', 
      details: error.message,
      code: error.code 
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const userSnapshot = await db.collection('users').where('email', '==', email).get();
    if (userSnapshot.empty) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const userDoc = userSnapshot.docs[0];
    const user = userDoc.data();

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(userDoc.id);
    res.json({
      message: 'Login successful',
      token,
      userId: userDoc.id,
      user: {
        name: user.name,
        email: user.email,
        department: user.department,
        campus: user.campus,
        totalPoints: user.totalPoints,
        totalEmissions: user.totalEmissions
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get user profile
router.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userDoc.data();
    res.json({
      userId,
      name: user.name,
      email: user.email,
      department: user.department,
      campus: user.campus,
      totalPoints: user.totalPoints || 0,
      totalEmissions: user.totalEmissions || 0,
      totalDistance: user.totalDistance || 0
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

module.exports = router;
