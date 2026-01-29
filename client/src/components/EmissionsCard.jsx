import React from 'react';
import FullscreenModal from './FullscreenModal';

const EmissionsCard = ({ data }) => {
  const [fullscreenOpen, setFullscreenOpen] = React.useState(false);

  if (!data) return null;

  const totalEmissions = (data.profile?.totalEmissions || 0).toFixed(4);
  const dailyEmissions = (data.todayStats?.emissions || 0).toFixed(4);
  const weeklyEmissions = (data.weeklyEmissions || 0).toFixed(4);
  const monthlyEmissions = (data.monthlyEmissions || 0).toFixed(4);

  return (
    <>
      <div className="card emissions-card" style={{ cursor: 'pointer' }} onClick={() => setFullscreenOpen(true)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <div className="card-title" style={{ margin: '0' }}>💨 Carbon Emissions</div>
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
          <div className="stat-label">Total Emissions (All Time)</div>
          <div className="stat-value">
            {totalEmissions} <span className="stat-unit">kg CO₂</span>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Today's Emissions</div>
          <div className="stat-value">
            {dailyEmissions} <span className="stat-unit">kg CO₂</span>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-label">This Week</div>
          <div className="stat-value">
            {weeklyEmissions} <span className="stat-unit">kg CO₂</span>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-label">This Month</div>
          <div className="stat-value">
            {monthlyEmissions} <span className="stat-unit">kg CO₂</span>
          </div>
        </div>
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#F9FAFB', borderRadius: '8px', fontSize: '13px', color: '#4B5563', border: '1px solid #E5E7EB' }}>
          💡 Tip: {
            !data.todayStats?.mode ? "Track your transport to get personalized tips!" :
              data.todayStats?.mode === 'car' ? "Switching to public transport can save 2.6kg CO2/trip." :
                data.todayStats?.mode === 'ev' ? "Great job using an EV! Charge with solar if possible." :
                  data.todayStats?.mode === 'bicycle' || data.todayStats?.mode === 'walking' ? "Zero emissions! You're doing amazing!" :
                    "Small changes in your commute make a big difference."
          }
        </div>
      </div>

      <FullscreenModal isOpen={fullscreenOpen} onClose={() => setFullscreenOpen(false)} title="Carbon Emissions Details">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #E5E7EB', textAlign: 'center', background: '#FFFFFF' }}>
            <p style={{ color: '#6B7280', margin: '0 0 10px 0', fontSize: '14px' }}>🌍 Total Emissions (All Time)</p>
            <p style={{ color: '#1F2937', fontSize: '32px', margin: '0', fontWeight: 'bold' }}>{totalEmissions}</p>
            <p style={{ color: '#9CA3AF', margin: '5px 0 0 0', fontSize: '12px' }}>kg CO₂</p>
          </div>
          <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #E5E7EB', textAlign: 'center', background: '#FFFFFF' }}>
            <p style={{ color: '#6B7280', margin: '0 0 10px 0', fontSize: '14px' }}>☀️ Today's Emissions</p>
            <p style={{ color: '#1F2937', fontSize: '32px', margin: '0', fontWeight: 'bold' }}>{dailyEmissions}</p>
            <p style={{ color: '#9CA3AF', margin: '5px 0 0 0', fontSize: '12px' }}>kg CO₂</p>
          </div>
          <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #E5E7EB', textAlign: 'center', background: '#FFFFFF' }}>
            <p style={{ color: '#6B7280', margin: '0 0 10px 0', fontSize: '14px' }}>📅 This Week</p>
            <p style={{ color: '#1F2937', fontSize: '32px', margin: '0', fontWeight: 'bold' }}>{weeklyEmissions}</p>
            <p style={{ color: '#9CA3AF', margin: '5px 0 0 0', fontSize: '12px' }}>kg CO₂</p>
          </div>
          <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #E5E7EB', textAlign: 'center', background: '#FFFFFF' }}>
            <p style={{ color: '#6B7280', margin: '0 0 10px 0', fontSize: '14px' }}>📆 This Month</p>
            <p style={{ color: '#1F2937', fontSize: '32px', margin: '0', fontWeight: 'bold' }}>{monthlyEmissions}</p>
            <p style={{ color: '#9CA3AF', margin: '5px 0 0 0', fontSize: '12px' }}>kg CO₂</p>
          </div>
        </div>
        <div style={{ backgroundColor: '#F0FDF4', padding: '25px', borderRadius: '12px', border: '1px solid #BBF7D0' }}>
          <h3 style={{ color: '#166534', marginTop: '0', fontSize: '18px' }}>🌱 Emission Reduction Tips</h3>
          <ul style={{ color: '#374151', lineHeight: '1.8' }}>
            {(!data.todayStats?.mode || data.todayStats?.mode === 'Not recorded') && (
              <>
                <li>📊 Start tracking your daily commute to see your impact</li>
                <li>🚶 Walking is the healthiest way to travel short distances</li>
                <li>🚴 Cycling produces zero emissions and improves fitness</li>
              </>
            )}
            {(data.todayStats?.mode === 'car') && (
              <>
                <li>🚗 Carpooling can reduce your emissions per journey by 50%</li>
                <li>🚌 Switching to public transport saves ~2.6kg CO2 per trip</li>
                <li>⚡ Consider an Electric Vehicle for your next car purchase</li>
              </>
            )}
            {(data.todayStats?.mode === 'bike') && (
              <>
                <li>⚡ Electric bikes are a great eco-friendly upgrade</li>
                <li>🚌 Public transport is safer and greener for long trips</li>
                <li>🔧 Regular maintenance improves fuel efficiency</li>
              </>
            )}
            {(data.todayStats?.mode === 'bus' || data.todayStats?.mode === 'train') && (
              <>
                <li>🚶 Try walking effectively for the first/last mile</li>
                <li>🎧 Audiobooks make public transport productive time</li>
                <li>🤝 Encourage colleagues to join you on public transit</li>
              </>
            )}
            {(data.todayStats?.mode === 'bicycle' || data.todayStats?.mode === 'walking') && (
              <>
                <li>🏆 You are already a carbon zero hero!</li>
                <li>📸 Share your eco-commute photos to inspire others</li>
                <li>🌧️ Check weather forecasts to plan your zero-carbon trips</li>
              </>
            )}
            {(data.todayStats?.mode === 'ev') && (
              <>
                <li>🔋 Charge with renewable energy for true zero emissions</li>
                <li>🛣️ Plan efficient routes to maximize battery range</li>
                <li>🚗 Share your EV experience to encourage adoption</li>
              </>
            )}
          </ul>
        </div>
      </FullscreenModal>
    </>
  );
};

export default EmissionsCard;
