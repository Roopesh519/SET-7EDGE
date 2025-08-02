import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

// ✅ Automatically attach token on each request
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Handle token expiration globally
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.data?.code === 'TOKEN_EXPIRED') {
      // Dispatch custom event for the modal to handle
      const sessionExpiredEvent = new CustomEvent('sessionExpired');
      window.dispatchEvent(sessionExpiredEvent);
    }
    return Promise.reject(error);
  }
);

export default instance;
