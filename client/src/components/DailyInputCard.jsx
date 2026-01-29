import React from 'react';

const DailyInputCard = ({ onRecordAdded, onModeChange }) => {
  const [formData, setFormData] = React.useState({
    mode: 'car',
    distance: '',
    trips: '1'
  });
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    if (name === 'mode' && onModeChange) {
      onModeChange(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { addDailyRecord } = require('../utils/api');
      await addDailyRecord(formData);
      setMessage('✅ Daily record added successfully!');
      setFormData({ mode: 'car', distance: '', trips: '1' });
      setTimeout(() => setMessage(''), 3000);
      onRecordAdded();
    } catch (error) {
      setMessage('❌ Failed to add record: ' + (error.response?.data?.error || 'Error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-title">📝 Log Today's Transport</div>
      <form onSubmit={handleSubmit}>
        <select
          name="mode"
          value={formData.mode}
          onChange={handleInputChange}
        >
          <option value="car">🚗 Car</option>
          <option value="bike">🏍️ Bike</option>
          <option value="bus">🚌 Bus</option>
          <option value="bicycle">🚴 Bicycle</option>
          <option value="walking">🚶 Walking</option>
          <option value="ev">⚡ Electric Vehicle</option>
        </select>
        <input
          type="number"
          name="distance"
          placeholder="Distance (km)"
          value={formData.distance}
          onChange={handleInputChange}
          step="0.1"
          required
        />
        <input
          type="number"
          name="trips"
          placeholder="Number of trips"
          value={formData.trips}
          onChange={handleInputChange}
          min="1"
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding...' : '➕ Add Record'}
        </button>
      </form>
      {message && <div style={{
        marginTop: '15px',
        padding: '12px',
        backgroundColor: message.includes('✅') ? '#F0FDF4' : '#FEF2F2',
        color: message.includes('✅') ? '#166534' : '#991B1B',
        border: `1px solid ${message.includes('✅') ? '#BBF7D0' : '#FECACA'}`,
        borderRadius: '8px',
        textAlign: 'center',
        fontSize: '14px'
      }}>{message}</div>}
    </div>
  );
};

export default DailyInputCard;
