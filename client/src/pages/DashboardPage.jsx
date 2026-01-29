import React from 'react';
import './DashboardPage.css';
import ProfileCard from '../components/ProfileCard';
import EmissionsCard from '../components/EmissionsCard';
import PointsCard from '../components/PointsCard';
import LeaderboardCard from '../components/LeaderboardCard';
import DailyInputCard from '../components/DailyInputCard';
import ChartsCard from '../components/ChartsCard';
import ViewOthersModal from '../components/ViewOthersModal';
import ComparisonCard from '../components/ComparisonCard';
import AutomaticTrackingCard from '../components/AutomaticTrackingCard';

const DashboardPage = ({ userId, user, onLogout, onNavigateToPlanner }) => {
  const [dashboardData, setDashboardData] = React.useState(null);
  const [currentInputMode, setCurrentInputMode] = React.useState('car');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [showOthersModal, setShowOthersModal] = React.useState(false);

  React.useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [userId]);

  const fetchDashboardData = async () => {
    try {
      const { getDashboard } = require('../utils/api');
      console.log('Fetching dashboard for userId:', userId);
      const response = await getDashboard(userId);
      console.log('Dashboard data received:', response.data);
      setDashboardData(response.data);
      setError('');
    } catch (err) {
      console.error('Dashboard fetch error:', err.response?.data || err.message);
      // If user not found (404), logout and return to auth page
      if (err.response?.status === 404) {
        console.log('User not found, logging out...');
        onLogout();
        return;
      }
      setError('Failed to load dashboard data: ' + (err.response?.data?.details || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDailyRecordAdded = () => {
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="dashboard-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>GreenSteps 🌳</h1>
        <div className="header-actions">
          <button
            onClick={onNavigateToPlanner}
            className="view-others-btn"
            style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534' }}
          >
            🗺️ Plan Route
          </button>
          <button
            onClick={() => setShowOthersModal(true)}
            className="view-others-btn"
            title="View others' contributions"
          >
            👥 View Others
          </button>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      {showOthersModal && (
        <ViewOthersModal
          department={dashboardData?.profile?.department}
          onClose={() => setShowOthersModal(false)}
        />
      )}

      <div className="dashboard-grid">
        {/* Profile Section */}
        <ProfileCard user={dashboardData?.profile} />

        {/* Daily Input Section */}
        <DailyInputCard
          onRecordAdded={handleDailyRecordAdded}
          onModeChange={setCurrentInputMode}
        />

        {/* Automatic Tracking Section */}
        <AutomaticTrackingCard
          userId={userId}
          onRecordAdded={handleDailyRecordAdded}
        />


        {/* Emissions Section */}
        <EmissionsCard data={dashboardData} />

        {/* Points & Rewards Section */}
        <PointsCard
          data={dashboardData}
          selectedMode={currentInputMode}
        />


        {/* Comparison Section */}
        <ComparisonCard
          userEmissions={dashboardData?.profile?.totalEmissions}
          weeklyEmissions={dashboardData?.weeklyEmissions}
          department={dashboardData?.profile?.department}
          campus={dashboardData?.profile?.campus}
        />

        {/* Charts Section */}
        <ChartsCard userId={userId} />

        {/* Leaderboard Section */}
        <LeaderboardCard
          department={dashboardData?.profile?.department}
          campus={dashboardData?.profile?.campus}
          userId={userId}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
