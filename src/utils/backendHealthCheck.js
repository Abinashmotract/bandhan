// Backend health check utility
import axios from 'axios';
import { API_BASE_URL } from './api';

export const checkBackendHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/health`, {
      timeout: 5000
    });
    return { isHealthy: true, status: response.status };
  } catch (error) {
    console.error('Backend health check failed:', error.message);
    return { 
      isHealthy: false, 
      error: error.message,
      status: error.response?.status || 'No response'
    };
  }
};

export const checkMatchesEndpoint = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/matches`, {
      timeout: 5000,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
      }
    });
    return { isWorking: true, status: response.status };
  } catch (error) {
    console.error('Matches endpoint check failed:', error.message);
    return { 
      isWorking: false, 
      error: error.message,
      status: error.response?.status || 'No response'
    };
  }
};
