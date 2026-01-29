import React from 'react';
import './AuthPage.css';

export const AuthPage = ({ onAuthSuccess }) => {
  const [isSignup, setIsSignup] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    department: '',
    campus: '',
    password: '',
    transport: {
      mode: '',
      averageDistance: '',
      frequency: ''
    }
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [transportSuggestions, setTransportSuggestions] = React.useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = React.useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('transport')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        transport: { ...formData.transport, [field]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });

      // Fetch AI suggestions when department changes
      if (name === 'department' && value) {
        fetchAISuggestions(formData.name, value, formData.campus);
      }
    }
  };

  const fetchAISuggestions = async (name, department, campus) => {
    setLoadingSuggestions(true);
    try {
      const { getTransportSuggestions } = require('../utils/api');
      const response = await getTransportSuggestions({
        name: name || 'User',
        department,
        campus: campus || 'Main Campus'
      });
      setTransportSuggestions(response.data.suggestions);
    } catch (err) {
      console.error('Failed to fetch suggestions:', err);
      // Fallback to default options
      setTransportSuggestions([
        { mode: 'walking', reason: 'Zero emissions' },
        { mode: 'bicycle', reason: 'Eco-friendly' },
        { mode: 'bus', reason: 'Public transport' },
        { mode: 'ev', reason: 'Electric vehicle' },
        { mode: 'bike', reason: 'Low emissions' },
        { mode: 'car', reason: 'Traditional vehicle' }
      ]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { signup, login } = require('../utils/api');
      const endpoint = isSignup ? signup : login;

      const response = await endpoint(isSignup ? formData : {
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      onAuthSuccess(response.data.userId, response.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-card">
          <h1>
            <span role="img" aria-label="leaf" style={{ color: '#4ade80' }}>🍃</span>
            GreenSteps
          </h1>
          <h2>{isSignup ? 'Join the movement. Track your carbon footprint.' : 'Welcome back to GreenSteps'}</h2>

          <form onSubmit={handleSubmit}>
            {isSignup && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="department"
                  placeholder="Department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="campus"
                  placeholder="Campus"
                  value={formData.campus}
                  onChange={handleInputChange}
                  required
                />
              </>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <div className="password-input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            {isSignup && (
              <>
                <select
                  name="transport.mode"
                  value={formData.transport.mode}
                  onChange={handleInputChange}
                >
                  <option value="">
                    {loadingSuggestions ? '⏳ Loading AI suggestions...' : '📍 Select transport mode'}
                  </option>
                  {transportSuggestions.length > 0 ? (
                    transportSuggestions.map((suggestion, idx) => (
                      <option key={idx} value={suggestion.mode}>
                        {suggestion.mode.charAt(0).toUpperCase() + suggestion.mode.slice(1)}
                        ({suggestion.relevance || 'suggested'})
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="walking">Walking</option>
                      <option value="bicycle">Bicycle</option>
                      <option value="bus">Bus</option>
                      <option value="ev">Electric Vehicle</option>
                      <option value="bike">Bike</option>
                      <option value="car">Car</option>
                    </>
                  )}
                </select>
                {transportSuggestions.length > 0 && formData.transport.mode && (
                  <div className="ai-suggestion-box">
                    <p>
                      <strong>AI Suggestion:</strong> {' '}
                      {transportSuggestions.find(s => s.mode === formData.transport.mode)?.reason}
                    </p>
                  </div>
                )}
                <input
                  type="number"
                  name="transport.averageDistance"
                  placeholder="Average Distance (km/day)"
                  value={formData.transport.averageDistance}
                  onChange={handleInputChange}
                  step="0.1"
                />
                <input
                  type="number"
                  name="transport.frequency"
                  placeholder="Frequency (trips/week)"
                  value={formData.transport.frequency}
                  onChange={handleInputChange}
                />
              </>
            )}

            {error && <div className="error-message">{error}</div>}

            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : isSignup ? 'Sign Up' : 'Login'}
            </button>
          </form>

          <p className="toggle-auth">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="toggle-btn"
            >
              {isSignup ? 'Login' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-visual-container">
          <img src="/assets/eco_footprint.png" alt="Eco Footprint" className="auth-tree-image" />
          <div className="auth-visual-overlay">
            <h3>Start Your Eco-Journey</h3>
            <p>Every step counts towards a greener planet.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
