import React from 'react';

const ProfileCard = ({ user }) => {
  if (!user) return null;

  return (
    <div className="card profile-card">
      <div className="card-title">👤 Profile</div>
      <div className="stat-item">
        <div className="stat-label">Name</div>
        <div className="stat-value">{user.name}</div>
      </div>
      <div className="stat-item">
        <div className="stat-label">Email</div>
        <div className="stat-value" style={{ fontSize: '16px' }}>{user.email}</div>
      </div>
      <div className="stat-item">
        <div className="stat-label">Department</div>
        <div className="stat-value">{user.department}</div>
      </div>
      <div className="stat-item">
        <div className="stat-label">Campus</div>
        <div className="stat-value">{user.campus}</div>
      </div>
    </div>
  );
};

export default ProfileCard;
