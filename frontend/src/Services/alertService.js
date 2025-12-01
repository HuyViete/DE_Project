import api from '../lib/axios';

export const getAlerts = async () => {
  const response = await api.get('/alerts');
  return response.data;
};

export const markRead = async (alertId) => {
  const response = await api.post('/alerts/read', { alertId });
  return response.data;
};

export const getSettings = async () => {
  const response = await api.get('/alerts/settings');
  return response.data;
};

export const updateSettings = async (settings) => {
  const response = await api.post('/alerts/settings', { settings });
  return response.data;
};
