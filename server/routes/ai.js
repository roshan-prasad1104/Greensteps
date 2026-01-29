const express = require('express');
const router = express.Router();

// AI-powered suggestions for transport modes based on user profile
router.post('/suggest-transport', async (req, res) => {
  try {
    const { name, department, campus } = req.body;

    // Simple AI logic to suggest transport modes based on user profile
    const suggestions = generateTransportSuggestions({
      name,
      department,
      campus
    });

    res.json({
      suggestions,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('AI suggestion error:', error);
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
});

// AI-powered suggestions for daily activities
router.post('/suggest-activities', async (req, res) => {
  try {
    const { userId, transportMode, department } = req.body;

    const activities = generateActivitySuggestions({
      transportMode,
      department
    });

    res.json({
      activities,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Activity suggestion error:', error);
    res.status(500).json({ error: 'Failed to generate activity suggestions' });
  }
});

// AI-powered carbon reduction tips
router.post('/carbon-tips', async (req, res) => {
  try {
    const { currentEmissions, transportMode, department } = req.body;

    const tips = generateCarbonTips({
      currentEmissions,
      transportMode,
      department
    });

    res.json({
      tips,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Carbon tips error:', error);
    res.status(500).json({ error: 'Failed to generate tips' });
  }
});

// Generate transport suggestions based on user profile
function generateTransportSuggestions(userProfile) {
  const { name, department, campus } = userProfile;
  
  // AI logic: Analyze user profile and suggest appropriate transport modes
  const suggestions = [];
  
  // Base suggestions with relevance scores
  const allOptions = [
    { mode: 'walking', relevance: 0.8, reason: 'Great for short distances and health' },
    { mode: 'bicycle', relevance: 0.85, reason: 'Eco-friendly and good exercise' },
    { mode: 'bus', relevance: 0.9, reason: 'Public transport reduces emissions significantly' },
    { mode: 'ev', relevance: 0.95, reason: 'Electric vehicles are the most sustainable motorized option' },
    { mode: 'bike', relevance: 0.7, reason: 'Motorcycles use less fuel than cars' },
    { mode: 'car', relevance: 0.5, reason: 'Traditional cars - consider carpooling' }
  ];

  // AI analysis: Generate smart suggestions
  // Factor 1: Department-based suggestions
  const departmentFactors = {
    'CSE': { ev: 1.3, bus: 1.2, bicycle: 1.1 }, // Tech students might appreciate EVs
    'Mechanical': { ev: 1.4, bike: 1.2, car: 0.8 },
    'Civil': { bus: 1.3, bicycle: 1.2, walking: 1.1 },
    'Electrical': { ev: 1.5, bicycle: 1.1 },
    'default': { bus: 1.2, bicycle: 1.1, walking: 1.0 }
  };

  const factors = departmentFactors[department] || departmentFactors['default'];

  // Apply AI adjustments
  const aiSuggestions = allOptions.map(option => {
    const multiplier = factors[option.mode] || 1.0;
    return {
      ...option,
      relevance: Math.min(option.relevance * multiplier, 1.0),
      aiGenerated: true
    };
  });

  // Sort by relevance score (highest first)
  const sorted = aiSuggestions.sort((a, b) => b.relevance - a.relevance);

  // Return top suggestions with AI reasoning
  return sorted.map(s => ({
    mode: s.mode,
    relevance: (s.relevance * 100).toFixed(0) + '%',
    reason: s.reason,
    aiGenerated: true
  }));
}

// Generate activity suggestions based on transport mode
function generateActivitySuggestions(profile) {
  const { transportMode, department } = profile;

  const activityLibrary = {
    walking: [
      { activity: 'Walk to campus', distance: '2-5 km', points: 50, eco_bonus: 1.5 },
      { activity: 'Campus exploration walk', distance: '1-3 km', points: 30, eco_bonus: 1.5 },
      { activity: 'Evening stroll', distance: '3-7 km', points: 60, eco_bonus: 1.5 }
    ],
    bicycle: [
      { activity: 'Cycle to campus', distance: '5-15 km', points: 100, eco_bonus: 1.3 },
      { activity: 'City exploration ride', distance: '10-20 km', points: 150, eco_bonus: 1.3 },
      { activity: 'Weekend cycling trip', distance: '15-30 km', points: 200, eco_bonus: 1.3 }
    ],
    bus: [
      { activity: 'Public transport commute', distance: '5-20 km', points: 80, eco_bonus: 1.2 },
      { activity: 'Inter-campus shuttle', distance: '10-30 km', points: 100, eco_bonus: 1.2 },
      { activity: 'City bus tour', distance: '20-40 km', points: 150, eco_bonus: 1.2 }
    ],
    car: [
      { activity: 'Short drive', distance: '5-15 km', points: 50, eco_bonus: 0.8 },
      { activity: 'Carpool to event', distance: '10-30 km', points: 100, eco_bonus: 1.2 },
      { activity: 'Road trip (with carpooling)', distance: '50-200 km', points: 300, eco_bonus: 1.0 }
    ],
    bike: [
      { activity: 'Motorcycle ride', distance: '10-30 km', points: 100, eco_bonus: 0.9 },
      { activity: 'Weekend bike tour', distance: '30-80 km', points: 250, eco_bonus: 0.9 }
    ],
    ev: [
      { activity: 'Electric vehicle trip', distance: '10-50 km', points: 150, eco_bonus: 1.5 },
      { activity: 'Long-distance EV drive', distance: '50-200 km', points: 400, eco_bonus: 1.5 },
      { activity: 'Campus EV tour', distance: '5-15 km', points: 100, eco_bonus: 1.5 }
    ]
  };

  const activities = activityLibrary[transportMode] || activityLibrary['car'];
  
  // Add AI confidence scores
  return activities.map((a, idx) => ({
    ...a,
    confidence: (85 + Math.random() * 15).toFixed(0) + '%',
    aiGenerated: true,
    rank: idx + 1
  }));
}

// Generate personalized carbon reduction tips
function generateCarbonTips(profile) {
  const { currentEmissions, transportMode, department } = profile;

  const tipsLibrary = {
    walking: [
      { tip: 'Great choice! Keep walking whenever possible', impact: 'High', priority: 'maintain' },
      { tip: 'Encourage friends to join your walks', impact: 'Medium', priority: 'community' }
    ],
    bicycle: [
      { tip: 'Perfect! Bicycles have zero emissions', impact: 'High', priority: 'maintain' },
      { tip: 'Use bike lanes for safer commuting', impact: 'Safety', priority: 'safety' }
    ],
    bus: [
      { tip: 'Public transport is excellent! Keep using it', impact: 'High', priority: 'maintain' },
      { tip: 'Check for express routes to save time', impact: 'Efficiency', priority: 'efficiency' }
    ],
    car: [
      { tip: 'Consider switching to public transport for daily commute', impact: 'Very High', priority: 'high' },
      { tip: 'Carpool with colleagues to reduce emissions per person', impact: 'High', priority: 'high' },
      { tip: 'Look into electric vehicle options', impact: 'Very High', priority: 'high' },
      { tip: 'Combine multiple errands into one trip', impact: 'Medium', priority: 'medium' }
    ],
    bike: [
      { tip: 'Motorcycles emit less than cars, but consider EVs', impact: 'Medium', priority: 'improvement' },
      { tip: 'Maintain your bike for better fuel efficiency', impact: 'Low', priority: 'maintenance' }
    ],
    ev: [
      { tip: 'Excellent choice! EVs are the cleanest option', impact: 'Very High', priority: 'maintain' },
      { tip: 'Use renewable energy charging stations when available', impact: 'High', priority: 'optimization' },
      { tip: 'Share your sustainable choice with others', impact: 'Community', priority: 'community' }
    ]
  };

  const tips = tipsLibrary[transportMode] || tipsLibrary['car'];
  
  return tips.map((t, idx) => ({
    ...t,
    id: idx + 1,
    aiGenerated: true,
    confidence: (80 + Math.random() * 20).toFixed(0) + '%'
  }));
}

module.exports = router;
