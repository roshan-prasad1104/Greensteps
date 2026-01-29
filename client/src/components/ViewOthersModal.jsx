import React from 'react';
import './ViewOthersModal.css';
import { getDepartmentLeaderboard } from '../utils/api';

const ViewOthersModal = ({ department, onClose }) => {
  const [leaderboard, setLeaderboard] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    fetchOthersData();
  }, [department]);

  const fetchOthersData = async () => {
    try {
      setLoading(true);
      const response = await getDepartmentLeaderboard(department);
      setLeaderboard(response.data.leaderboard || []);
      setError('');
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
      setError('Could not load others data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>👥 {department} Department - Top Contributors</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {loading && <div className="modal-loading">Loading community data...</div>}
        {error && <div className="modal-error">{error}</div>}

        {!loading && !error && (
          <div className="modal-body">
            {leaderboard.length === 0 ? (
              <p className="no-data">No contributors yet. Be the first! 🌱</p>
            ) : (
              <div className="others-grid">
                {leaderboard.map((user, idx) => (
                  <div key={idx} className="user-card">
                    <div className="rank-badge">#{idx + 1}</div>
                    <div className="user-info">
                      <h3>{user.name}</h3>
                      <p className="points">⭐ {user.totalPoints || 0} pts</p>
                      <p className="emissions">🌍 {(user.totalEmissions || 0).toFixed(2)} kg CO₂</p>
                      <p className="distance">🚴 {(user.totalDistance || 0).toFixed(2)} km</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="modal-footer">
          <button className="btn-close" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ViewOthersModal;
