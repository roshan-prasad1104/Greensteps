import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL ||
  (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api');

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signup = (data) => api.post('/auth/signup', data);
export const login = (data) => api.post('/auth/login', data);
export const getUserProfile = (userId) => api.get(`/auth/profile/${userId}`);

export const addDailyRecord = (data) => api.post('/dashboard/daily', data);
export const getDashboard = (userId) => api.get(`/dashboard/dashboard/${userId}`);
export const getEmissionsHistory = (userId, period) =>
  api.get(`/dashboard/emissions-history/${userId}`, { params: { period } });

export const getDepartmentLeaderboard = (department) =>
  api.get(`/leaderboard/department/${encodeURIComponent(department)}`);
export const getCampusLeaderboard = (campus) =>
  api.get(`/leaderboard/campus/${encodeURIComponent(campus)}`);
export const getUserRank = (userId, department, campus) =>
  api.get(`/leaderboard/rank/${userId}/${encodeURIComponent(department)}/${encodeURIComponent(campus)}`);
export const getEmissionsAverages = (department, campus) =>
  api.get(`/leaderboard/averages/${encodeURIComponent(department)}/${encodeURIComponent(campus)}`);

export const updateTransport = (data) => api.post('/transport/update', data);
export const getTransport = (userId) => api.get(`/transport/${userId}`);

// AI Suggestions
export const getTransportSuggestions = (userProfile) =>
  api.post('/ai/suggest-transport', userProfile);
export const getActivitySuggestions = (profile) =>
  api.post('/ai/suggest-activities', profile);
export const getCarbonTips = (profile) =>
  api.post('/ai/carbon-tips', profile);

export default api;
