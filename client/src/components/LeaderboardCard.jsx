import React from 'react';
import FullscreenModal from './FullscreenModal';

const LeaderboardCard = ({ department, campus, userId }) => {
  const [activeTab, setActiveTab] = React.useState('department');
  const [leaderboard, setLeaderboard] = React.useState([]);
  const [userRank, setUserRank] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [fullscreenOpen, setFullscreenOpen] = React.useState(false);

  React.useEffect(() => {
    fetchLeaderboard();
  }, [activeTab, department, campus, userId]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const { getDepartmentLeaderboard, getCampusLeaderboard, getUserRank } = require('../utils/api');

      if (activeTab === 'department' && department) {
        const response = await getDepartmentLeaderboard(department);
        setLeaderboard(response.data);
      } else if (activeTab === 'campus' && campus) {
        const response = await getCampusLeaderboard(campus);
        setLeaderboard(response.data);
      }

      if (department && campus) {
        const rankResponse = await getUserRank(userId, department, campus);
        setUserRank(rankResponse.data);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="card" style={{ gridColumn: '1 / -1', cursor: 'pointer' }} onClick={() => setFullscreenOpen(true)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <div className="card-title" style={{ margin: '0' }}>🏆 Leaderboard</div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFullscreenOpen(true);
            }}
            style={{
              background: 'transparent',
              border: '1px solid #E5E7EB',
              color: '#6B7280',
              padding: '6px 10px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#F3F4F6';
              e.target.style.color = '#111827';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#6B7280';
            }}
            title="Expand"
          >
            ⛶ Expand
          </button>
        </div>

        {userRank && (
          <div style={{
            padding: '15px',
            backgroundColor: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: '8px',
            marginBottom: '15px',
            fontSize: '14px',
            color: '#1F2937'
          }}>
            <strong style={{ color: '#166534' }}>👤 Your Stats:</strong>
            {activeTab === 'department' && (
              <>
                <br />Your Rank: <strong style={{ color: '#059669', fontSize: '16px' }}>#{userRank.departmentRank}</strong> of {userRank.departmentTotal} in {department}
              </>
            )}
            {activeTab === 'campus' && (
              <>
                <br />Your Rank: <strong style={{ color: '#059669', fontSize: '16px' }}>#{userRank.campusRank}</strong> of {userRank.campusTotal} in {campus}
              </>
            )}
            <br />Points: <strong style={{ color: '#059669', fontSize: '16px' }}>{userRank.userPoints} ⭐</strong>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <button
            onClick={(e) => { e.stopPropagation(); setActiveTab('department'); }}
            style={{
              padding: '8px 16px',
              backgroundColor: activeTab === 'department' ? '#F0FDF4' : '#FFFFFF',
              color: activeTab === 'department' ? '#166534' : '#6B7280',
              border: `1px solid ${activeTab === 'department' ? '#166534' : '#E5E7EB'}`,
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              transition: 'all 0.2s ease',
            }}
          >
            🏢 Department
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setActiveTab('campus'); }}
            style={{
              padding: '8px 16px',
              backgroundColor: activeTab === 'campus' ? '#F0FDF4' : '#FFFFFF',
              color: activeTab === 'campus' ? '#166534' : '#6B7280',
              border: `1px solid ${activeTab === 'campus' ? '#166534' : '#E5E7EB'}`,
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              transition: 'all 0.2s ease',
            }}
          >
            🏫 Campus
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#6B7280' }}>⏳ Loading leaderboard...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#4B5563', fontWeight: '600', fontSize: '13px' }}>🏅 Rank</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#4B5563', fontWeight: '600', fontSize: '13px' }}>
                    {activeTab === 'department' ? '👤 Name' : '🏢 Department'}
                  </th>
                  <th style={{ textAlign: 'right', padding: '12px', color: '#4B5563', fontWeight: '600', fontSize: '13px' }}>⭐ Points</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.slice(0, 5).map((entry, index) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom: '1px solid #F3F4F6',
                      backgroundColor: index < 3 ? '#FFFFFB' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '12px', color: '#111827', fontWeight: '500', fontSize: '14px' }}>
                      {index === 0 && '🥇 1st'}
                      {index === 1 && '🥈 2nd'}
                      {index === 2 && '🥉 3rd'}
                      {index > 2 && <span style={{ color: '#6B7280' }}>#{entry.rank}</span>}
                    </td>
                    <td style={{ padding: '12px', color: '#374151' }}>{entry.name || entry.department}</td>
                    <td style={{ textAlign: 'right', padding: '12px', fontWeight: '600', color: '#059669' }}>
                      {entry.totalPoints}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <FullscreenModal
        isOpen={fullscreenOpen}
        onClose={() => setFullscreenOpen(false)}
        title={`Leaderboard - ${activeTab === 'department' ? 'Department' : 'Campus'}`}
      >
        <div style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
          <button
            onClick={() => setActiveTab('department')}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === 'department' ? '#22c55e' : '#FFFFFF',
              color: activeTab === 'department' ? 'white' : '#374151',
              border: `1px solid ${activeTab === 'department' ? '#22c55e' : '#D1D5DB'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s ease',
            }}
          >
            🏢 Department
          </button>
          <button
            onClick={() => setActiveTab('campus')}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === 'campus' ? '#22c55e' : '#FFFFFF',
              color: activeTab === 'campus' ? 'white' : '#374151',
              border: `1px solid ${activeTab === 'campus' ? '#22c55e' : '#D1D5DB'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s ease',
            }}
          >
            🏫 Campus
          </button>
        </div>

        {userRank && (
          <div style={{
            padding: '20px',
            backgroundColor: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: '12px',
            marginBottom: '25px',
            color: '#1F2937'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <div>
                <p style={{ color: '#4B5563', margin: '0 0 5px 0', fontSize: '14px' }}>Your Current Rank</p>
                <p style={{ color: '#166534', fontSize: '28px', margin: '0', fontWeight: 'bold' }}>
                  #{activeTab === 'department' ? userRank.departmentRank : userRank.campusRank}
                </p>
              </div>
              <div>
                <p style={{ color: '#4B5563', margin: '0 0 5px 0', fontSize: '14px' }}>Out of Total</p>
                <p style={{ color: '#166534', fontSize: '28px', margin: '0', fontWeight: 'bold' }}>
                  {activeTab === 'department' ? userRank.departmentTotal : userRank.campusTotal} Users
                </p>
              </div>
              <div>
                <p style={{ color: '#4B5563', margin: '0 0 5px 0', fontSize: '14px' }}>Your Total Points</p>
                <p style={{ color: '#166534', fontSize: '28px', margin: '0', fontWeight: 'bold' }}>
                  {userRank.userPoints} ⭐
                </p>
              </div>
              <div>
                <p style={{ color: '#4B5563', margin: '0 0 5px 0', fontSize: '14px' }}>Performance</p>
                <p style={{ color: '#166534', fontSize: '28px', margin: '0', fontWeight: 'bold' }}>
                  {activeTab === 'department'
                    ? ((userRank.departmentRank / userRank.departmentTotal) * 100).toFixed(1)
                    : ((userRank.campusRank / userRank.campusTotal) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280', fontSize: '16px' }}>⏳ Loading detailed leaderboard...</div>
        ) : (
          <div style={{ overflowX: 'auto', background: 'white', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
                  <th style={{ textAlign: 'center', padding: '15px', color: '#4B5563', fontWeight: '600' }}>🏅</th>
                  <th style={{ textAlign: 'left', padding: '15px', color: '#4B5563', fontWeight: '600' }}>👤 Name</th>
                  <th style={{ textAlign: 'center', padding: '15px', color: '#4B5563', fontWeight: '600' }}>⭐ Points</th>
                  <th style={{ textAlign: 'center', padding: '15px', color: '#4B5563', fontWeight: '600' }}>🌍 Emissions (kg CO₂)</th>
                  <th style={{ textAlign: 'center', padding: '15px', color: '#4B5563', fontWeight: '600' }}>🚴 Distance (km)</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.slice(0, 50).map((entry, index) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom: '1px solid #F3F4F6',
                      backgroundColor: index < 3 ? '#FAFAF9' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '15px', textAlign: 'center', color: '#111827', fontWeight: 'bold', fontSize: '16px' }}>
                      {index === 0 && '🥇'}
                      {index === 1 && '🥈'}
                      {index === 2 && '🥉'}
                      {index > 2 && `#${entry.rank}`}
                    </td>
                    <td style={{ padding: '15px', color: '#374151' }}>{entry.name || entry.department}</td>
                    <td style={{ textAlign: 'center', padding: '15px', fontWeight: '600', color: '#059669' }}>
                      {entry.totalPoints}
                    </td>
                    <td style={{ textAlign: 'center', padding: '15px', color: '#6B7280' }}>
                      {entry.totalEmissions?.toFixed(2) || 0}
                    </td>
                    <td style={{ textAlign: 'center', padding: '15px', color: '#6B7280' }}>
                      {entry.totalDistance?.toFixed(2) || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </FullscreenModal>
    </>
  );
};

export default LeaderboardCard;
