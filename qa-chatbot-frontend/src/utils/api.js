import axios from 'axios';
import tokenManager from './tokenManager';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

// ✅ Automatically attach token on each request
instance.interceptors.request.use(async (config) => {
  let token = tokenManager.getToken();
  
  // Check if token is expired and refresh if needed
  if (token && tokenManager.isTokenExpired(token)) {
    try {
      console.log('Token expired, refreshing before request...');
      const refreshResult = await tokenManager.refreshToken();
      token = refreshResult.token;
    } catch (error) {
      console.error('Failed to refresh token before request:', error);
      // Don't block the request, let it proceed and handle 401 in response interceptor
    }
  }
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Handle token expiration globally
instance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshResult = await tokenManager.refreshToken();
        
        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${refreshResult.token}`;
        return instance(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Dispatch session expired event
        const sessionExpiredEvent = new CustomEvent('sessionExpired');
        window.dispatchEvent(sessionExpiredEvent);
      }
    }
    
    // Handle other token-related errors
    if (error.response?.data?.code === 'TOKEN_EXPIRED') {
      const sessionExpiredEvent = new CustomEvent('sessionExpired');
      window.dispatchEvent(sessionExpiredEvent);
    }
    
    return Promise.reject(error);
  }
);

export default instance;
