import React from 'react';
import './App.css';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const [userId, setUserId] = React.useState(null);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    // Check if user is already logged in
    const storedUserId = localStorage.getItem('userId');
    const storedUser = localStorage.getItem('user');
    if (storedUserId && storedUser) {
      setUserId(storedUserId);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleAuthSuccess = (id, userData) => {
    setUserId(id);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    setUserId(null);
    setUser(null);
  };

  return (
    <div className="App">
      {!userId ? (
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      ) : (
        <DashboardPage
          userId={userId}
          user={user}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;
