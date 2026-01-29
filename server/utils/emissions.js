// Emission factors in kg CO2 per km
const EMISSION_FACTORS = {
  car: 0.23,
  bike: 0.11,
  bus: 0.05,
  walking: 0,
  bicycle: 0,
  ev: 0.05
};

// Points calculation based on mode and distance
const calculateEmissions = (mode, distance) => {
  const factor = EMISSION_FACTORS[mode.toLowerCase()] || 0;
  return parseFloat((factor * distance).toFixed(4));
};

const calculatePoints = (mode, distance) => {
  const emissions = calculateEmissions(mode, distance);
  
  // INVERSE RELATIONSHIP: Less emissions = More points
  // Base points = distance * 0.5
  // Multiplier based on emissions: lower emissions = higher multiplier
  
  const basePoints = distance * 0.5;
  let multiplier = 1;
  
  // Calculate multiplier based on emissions intensity (kg CO2 per km)
  const modeEmissionFactor = EMISSION_FACTORS[mode.toLowerCase()] || 0;
  
  if (modeEmissionFactor === 0) {
    // Zero-emission: Walking or Bicycle
    multiplier = 3.0; // 3x points
  } else if (modeEmissionFactor <= 0.05) {
    // Low-emission: EV or Bus (0.05 kg CO2/km)
    multiplier = 2.5; // 2.5x points
  } else if (modeEmissionFactor <= 0.11) {
    // Medium-emission: Bike (0.11 kg CO2/km)
    multiplier = 1.8; // 1.8x points
  } else {
    // High-emission: Car (0.23 kg CO2/km)
    multiplier = 0.5; // 0.5x points (penalty!)
  }
  
  return parseFloat((basePoints * multiplier).toFixed(2));
};

const getStreakBonus = (streakDays) => {
  if (streakDays >= 30) return 5;
  if (streakDays >= 15) return 3;
  if (streakDays >= 7) return 2;
  if (streakDays >= 5) return 1;
  return 0;
};

const getMilestones = (totalDistance, totalEmissionsSaved) => {
  const milestones = [];
  
  if (totalDistance >= 10) milestones.push({ name: 'First Steps', points: 5 });
  if (totalDistance >= 50) milestones.push({ name: 'Getting Serious', points: 10 });
  if (totalDistance >= 100) milestones.push({ name: 'Century', points: 25 });
  if (totalDistance >= 500) milestones.push({ name: 'Marathon', points: 50 });
  if (totalDistance >= 1000) milestones.push({ name: 'Legend', points: 100 });
  
  return milestones;
};

module.exports = {
  EMISSION_FACTORS,
  calculateEmissions,
  calculatePoints,
  getStreakBonus,
  getMilestones
};
