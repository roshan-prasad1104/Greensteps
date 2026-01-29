import React from 'react';
import FullscreenModal from './FullscreenModal';

const PointsCard = ({ data, selectedMode }) => {
  const [fullscreenOpen, setFullscreenOpen] = React.useState(false);

  if (!data) return null;

  const totalPoints = (data.profile?.totalPoints || 0).toFixed(0);
  const dailyPoints = (data.todayStats?.points || 0).toFixed(2);
  const streakDays = data.streak?.days || 0;
  const streakBonus = data.streak?.bonus || 0;
  const totalEmissions = (data.profile?.totalEmissions || 0).toFixed(2);

  const getSuggestions = (mode, totalEmissions, totalPoints) => {
    const suggestions = [];

    // Base suggestions based on transport mode
    if (!mode || mode === 'Not recorded') {
      suggestions.push('🚀 Start tracking today → Earn 10+ points');
      suggestions.push('🌱 Any eco-journey counts → Get rewarded');
    } else if (mode === 'car' || mode === 'bike') {
      suggestions.push('🚴 Try using a bicycle → +0.5 bonus multiplier');
      suggestions.push('⚡ Switch to EV → +0.5 bonus multiplier');
      suggestions.push('🚌 Use public transport → +0.5 bonus multiplier');
    } else if (mode === 'bus') {
      suggestions.push('🚴 Add a bicycle trip → Diversify transport');
      suggestions.push('⚡ Combine with EV → Get 1.5x eco-bonus');
      suggestions.push('🌍 You\'re already eco-friendly! Keep it up!');
    } else if (mode === 'bicycle' || mode === 'walking') {
      suggestions.push('👑 Excellent choice! You\'re a carbon hero!');
      suggestions.push('🏆 Maintain this streak for extra rewards');
      suggestions.push('📈 Already at max eco-bonus multiplier');
    } else if (mode === 'ev') {
      suggestions.push('🌟 Perfect! Maximum environmental impact');
      suggestions.push('💚 Share your journey to inspire others');
      suggestions.push('🏅 Keep the streak alive for bonus points');
    }

    // Advanced suggestions based on emission levels
    if (totalEmissions > 10) {
      suggestions.unshift('⚠️ High emissions detected → Switch to sustainable transport');
    }

    // Gamification suggestions
    if (totalPoints < 100) {
      suggestions.push('🎯 Target: 100 points → Reach Bronze Badge');
    } else if (totalPoints < 500) {
      suggestions.push('🥈 Target: 500 points → Reach Silver Badge');
    } else if (totalPoints < 1000) {
      suggestions.push('🥇 Target: 1000 points → Reach Gold Badge');
    } else {
      suggestions.push('💎 You\'ve unlocked Diamond status!');
    }

    return suggestions.slice(0, 3); // Show top 3 suggestions
  };

  // Use selectedMode if available (from DailyInputCard), otherwise fallback to recorded mode
  const currentMode = selectedMode || data.todayStats?.mode;
  const suggestions = getSuggestions(currentMode, totalEmissions, totalPoints);

  return (
    <>
      <div className="card points-card" style={{ cursor: 'pointer' }} onClick={() => setFullscreenOpen(true)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <div className="card-title" style={{ margin: '0' }}>⭐ Points & Rewards</div>
          <button
            onClick={(e) => { e.stopPropagation(); setFullscreenOpen(true); }}
            style={{
              background: 'transparent',
              border: '1px solid #E5E7EB',
              color: '#6B7280',
              padding: '6px 10px',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.target.style.background = '#F3F4F6'; e.target.style.color = '#111827'; }}
            onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#6B7280'; }}
            title="Open fullscreen"
          >
            ⛶
          </button>
        </div>
        <div className="stat-item">
          <div className="stat-label">Total Points (All Time)</div>
          <div className="stat-value">{totalPoints}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Today's Points</div>
          <div className="stat-value">{dailyPoints}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">🔥 Current Streak</div>
          <div className="stat-value">{streakDays} days</div>
        </div>
        {streakBonus > 0 && (
          <div className="stat-item">
            <div className="stat-label">Streak Bonus</div>
            <div className="stat-value">+{streakBonus} points</div>
          </div>
        )}

        {suggestions.length > 0 && (
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#F9FAFB', borderRadius: '8px', fontSize: '13px', color: '#4B5563', border: '1px solid #E5E7EB' }}>
            <strong style={{ color: '#059669' }}>Suggestions based on usage:</strong>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', color: '#4B5563' }}>
              {suggestions.map((sugg, idx) => (
                <li key={idx}>{sugg}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <FullscreenModal isOpen={fullscreenOpen} onClose={() => setFullscreenOpen(false)} title="Points & Rewards Details">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #E5E7EB', textAlign: 'center', background: '#FFFFFF' }}>
            <p style={{ color: '#6B7280', margin: '0 0 10px 0', fontSize: '14px' }}>🏆 Total Points (All Time)</p>
            <p style={{ color: '#1F2937', fontSize: '32px', margin: '0', fontWeight: 'bold' }}>{totalPoints}</p>
            <p style={{ color: '#9CA3AF', margin: '5px 0 0 0', fontSize: '12px' }}>⭐</p>
          </div>
          <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #E5E7EB', textAlign: 'center', background: '#FFFFFF' }}>
            <p style={{ color: '#6B7280', margin: '0 0 10px 0', fontSize: '14px' }}>📍 Today's Points</p>
            <p style={{ color: '#1F2937', fontSize: '32px', margin: '0', fontWeight: 'bold' }}>{dailyPoints}</p>
            <p style={{ color: '#9CA3AF', margin: '5px 0 0 0', fontSize: '12px' }}>⭐</p>
          </div>
          <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #E5E7EB', textAlign: 'center', background: '#FFFFFF' }}>
            <p style={{ color: '#6B7280', margin: '0 0 10px 0', fontSize: '14px' }}>🔥 Current Streak</p>
            <p style={{ color: '#1F2937', fontSize: '32px', margin: '0', fontWeight: 'bold' }}>{streakDays}</p>
            <p style={{ color: '#9CA3AF', margin: '5px 0 0 0', fontSize: '12px' }}>days</p>
          </div>
          {streakBonus > 0 && (
            <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #E5E7EB', textAlign: 'center', background: '#FFFFFF' }}>
              <p style={{ color: '#6B7280', margin: '0 0 10px 0', fontSize: '14px' }}>🎁 Streak Bonus</p>
              <p style={{ color: '#1F2937', fontSize: '32px', margin: '0', fontWeight: 'bold' }}>+{streakBonus}</p>
              <p style={{ color: '#9CA3AF', margin: '5px 0 0 0', fontSize: '12px' }}>points</p>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div style={{ backgroundColor: '#F0F9FF', padding: '25px', borderRadius: '12px', border: '1px solid #BAE6FD' }}>
            <h3 style={{ color: '#0369A1', marginTop: '0', fontSize: '18px' }}>🎯 Streak Bonuses</h3>
            <ul style={{ color: '#334155', lineHeight: '1.8', margin: '10px 0 0 0', paddingLeft: '20px' }}>
              <li>5+ days: +1 bonus point</li>
              <li>7+ days: +2 bonus points</li>
              <li>15+ days: +3 bonus points</li>
              <li>30+ days: +5 bonus points</li>
            </ul>
          </div>
          <div style={{ backgroundColor: '#F0FDF4', padding: '25px', borderRadius: '12px', border: '1px solid #BBF7D0' }}>
            <h3 style={{ color: '#166534', marginTop: '0', fontSize: '18px' }}>💡 Eco-Friendly Multipliers</h3>
            <ul style={{ color: '#334155', lineHeight: '1.8', margin: '10px 0 0 0', paddingLeft: '20px' }}>
              <li>🚴 Bicycle: 1.5x bonus</li>
              <li>⚡ Electric Vehicle: 1.5x bonus</li>
              <li>🚌 Public Transport: 1.5x bonus</li>
              <li>🚶 Walking: 2.0x bonus</li>
              <li>🚗 Car: 1.0x (no bonus)</li>
            </ul>
          </div>
        </div>
      </FullscreenModal>
    </>
  );
};

export default PointsCard;
