import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import FullscreenModal from './FullscreenModal';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartsCard = ({ userId }) => {
  const [chartData, setChartData] = React.useState(null);
  const [period, setPeriod] = React.useState('week');
  const [loading, setLoading] = React.useState(true);
  const [fullscreenOpen, setFullscreenOpen] = React.useState(false);

  React.useEffect(() => {
    fetchChartData();
  }, [userId, period]);

  const fetchChartData = async () => {
    try {
      const { getEmissionsHistory } = require('../utils/api');
      const response = await getEmissionsHistory(userId, period);
      const data = response.data;

      const labels = Object.keys(data).sort();
      const emissions = labels.map(date => data[date].emissions);
      const points = labels.map(date => data[date].points);

      setChartData({ labels, emissions, points });
    } catch (error) {
      console.error('Failed to fetch chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !chartData) {
    return (
      <div className="card" style={{ gridColumn: '1 / -1' }}>
        <div style={{ textAlign: 'center', padding: '20px', color: '#6B7280' }}>Loading charts...</div>
      </div>
    );
  }

  const emissionsChartData = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Daily Emissions (kg CO₂)',
        data: chartData.emissions.map(v => Number(v) || 0),
        borderColor: '#10B981', // Emerald 500
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
        borderWidth: 2,
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: '#10B981',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      },
    ],
  };

  const pointsChartData = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Points Earned',
        data: chartData.points.map(v => Number(v) || 0),
        backgroundColor: '#F59E0B', // Amber 500
        borderColor: '#D97706', // Amber 600
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: '#374151',
          font: { size: 12, family: "'Inter', sans-serif" },
          usePointStyle: true,
          boxWidth: 8
        },
      },
      tooltip: {
        backgroundColor: '#FFFFFF',
        titleColor: '#111827',
        bodyColor: '#4B5563',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        titleFont: { size: 13, weight: '600' },
        bodyFont: { size: 12 },
        displayColors: true,
        boxPadding: 6,
        cornerRadius: 8,
        callbacks: {
          labelTextColor: () => '#4B5563'
        }
      },
    },
    scales: {
      y: {
        ticks: { color: '#9CA3AF', font: { size: 11 } },
        grid: { color: '#F3F4F6', drawBorder: false },
        border: { display: false }
      },
      x: {
        ticks: { color: '#9CA3AF', font: { size: 11 } },
        grid: { display: false },
        border: { display: false }
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  return (
    <>
      <div className="card" style={{ gridColumn: '1 / -1', cursor: 'pointer' }} onClick={() => setFullscreenOpen(true)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div className="card-title" style={{ margin: '0' }}>📊 CHARTS & ANALYTICS</div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid #E5E7EB',
                background: '#FFFFFF',
                color: '#374151',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '13px',
                outline: 'none'
              }}
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last Year</option>
            </select>
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
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#F9FAFB';
                e.currentTarget.style.color = '#111827';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#6B7280';
              }}
              title="Expand"
            >
              ⛶
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #F3F4F6', background: '#FFFFFF' }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#374151', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Emissions History</h4>
            <div style={{ height: '200px' }}>
              <Line data={emissionsChartData} options={{ ...chartOptions, maintainAspectRatio: false }} />
            </div>
          </div>
          <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #F3F4F6', background: '#FFFFFF' }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#374151', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Points Earned</h4>
            <div style={{ height: '200px' }}>
              <Bar data={pointsChartData} options={{ ...chartOptions, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </div>

      <FullscreenModal
        isOpen={fullscreenOpen}
        onClose={() => setFullscreenOpen(false)}
        title="Detailed Analytics"
      >
        <div className="fullscreen-grid">
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ padding: '25px', borderRadius: '12px', border: '1px solid #E5E7EB', background: '#ffffff' }}>
              <h3 style={{ marginTop: '0', marginBottom: '20px', color: '#10B981', fontSize: '18px', fontWeight: '600' }}>
                Emissions Trend ({period === 'week' ? '7 Days' : period === 'month' ? '30 Days' : '1 Year'})
              </h3>
              <div style={{ height: '300px' }}>
                <Line data={emissionsChartData} options={{ ...chartOptions, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ padding: '25px', borderRadius: '12px', border: '1px solid #E5E7EB', background: '#ffffff' }}>
              <h3 style={{ marginTop: '0', marginBottom: '20px', color: '#F59E0B', fontSize: '18px', fontWeight: '600' }}>
                Points Progress ({period === 'week' ? '7 Days' : period === 'month' ? '30 Days' : '1 Year'})
              </h3>
              <div style={{ height: '300px' }}>
                <Bar data={pointsChartData} options={{ ...chartOptions, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>

          <div className="fullscreen-card">
            <h3 style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '15px' }}>📊 Summary Statistics</h3>
            <div className="fullscreen-stat">
              <span className="fullscreen-stat-label">Total Emissions</span>
              <span className="fullscreen-stat-value" style={{ color: '#10B981' }}>
                {chartData?.emissions.reduce((a, b) => Number(a) + Number(b), 0).toFixed(2)} <span style={{ fontSize: '0.7em', color: '#6B7280' }}>kg CO₂</span>
              </span>
            </div>
            <div className="fullscreen-stat">
              <span className="fullscreen-stat-label">Total Points</span>
              <span className="fullscreen-stat-value" style={{ color: '#F59E0B' }}>
                {chartData?.points.reduce((a, b) => Number(a) + Number(b), 0)} <span style={{ fontSize: '0.7em', color: '#6B7280' }}>pts</span>
              </span>
            </div>
            <div className="fullscreen-stat">
              <span className="fullscreen-stat-label">Avg. Daily Emissions</span>
              <span className="fullscreen-stat-value">
                {(chartData?.emissions.reduce((a, b) => Number(a) + Number(b), 0) / (chartData?.emissions.length || 1)).toFixed(2)}
              </span>
            </div>
            <div className="fullscreen-stat">
              <span className="fullscreen-stat-label">Avg. Daily Points</span>
              <span className="fullscreen-stat-value">
                {(chartData?.points.reduce((a, b) => Number(a) + Number(b), 0) / (chartData?.points.length || 1)).toFixed(0)}
              </span>
            </div>
          </div>

          <div className="fullscreen-card">
            <h3 style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '15px' }}>🎯 Insights</h3>
            <div style={{ color: '#4B5563', fontSize: '14px', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span>✅</span>
                <span>Tracking your footprint is the first step to reducing it.</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span>💡</span>
                <span><strong>Tip:</strong> Swithing to public transport can save ~2.6kg CO₂ per trip.</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span>🏆</span>
                <span>You're building a sustainable habit!</span>
              </div>
            </div>
          </div>
        </div>
      </FullscreenModal>
    </>
  );
};

export default ChartsCard;
