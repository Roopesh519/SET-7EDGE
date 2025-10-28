// qa-chatbot-frontend/src/utils/tokenManager.js
import api from './api';

class TokenManager {
  constructor() {
    this.refreshPromise = null;
    this.isRefreshing = false;
    this.setupTokenRefresh();
  }

  // Get token from localStorage
  getToken() {
    return localStorage.getItem('token');
  }

  // Set token in localStorage
  setToken(token) {
    localStorage.setItem('token', token);
  }

  // Clear token from localStorage
  clearToken() {
    localStorage.removeItem('token');
  }

  // Check if token is expired (with 5 minute buffer)
  isTokenExpired(token) {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      const bufferTime = 5 * 60; // 5 minutes in seconds
      
      return payload.exp < (currentTime + bufferTime);
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  // Get token expiration time
  getTokenExpiration(token) {
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return new Date(payload.exp * 1000);
    } catch (error) {
      console.error('Error getting token expiration:', error);
      return null;
    }
  }

  // Refresh token
  async refreshToken() {
    if (this.isRefreshing) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this._performTokenRefresh();

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  // Internal method to perform token refresh
  async _performTokenRefresh() {
    const currentToken = this.getToken();
    
    if (!currentToken) {
      throw new Error('No token to refresh');
    }

    try {
      // Dispatch token refreshing event
      const tokenRefreshingEvent = new CustomEvent('tokenRefreshing');
      window.dispatchEvent(tokenRefreshingEvent);

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Refresh failed with status ${response.status}`);
      }

      const data = await response.json();
      const { token, user } = data;
      this.setToken(token);
      
      // Dispatch token refreshed event
      const tokenRefreshedEvent = new CustomEvent('tokenRefreshed', { 
        detail: { token, user } 
      });
      window.dispatchEvent(tokenRefreshedEvent);

      return { token, user };
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearToken();
      
      // Dispatch session expired event
      const sessionExpiredEvent = new CustomEvent('sessionExpired');
      window.dispatchEvent(sessionExpiredEvent);
      
      throw error;
    } finally {
      // Dispatch token refresh completed event to clear loading state
      const tokenRefreshCompletedEvent = new CustomEvent('tokenRefreshCompleted');
      window.dispatchEvent(tokenRefreshCompletedEvent);
    }
  }

  // Setup automatic token refresh
  setupTokenRefresh() {
    // Check token every 5 minutes
    setInterval(() => {
      const token = this.getToken();
      if (token && this.isTokenExpired(token)) {
        console.log('Token is expired or about to expire, refreshing...');
        this.refreshToken().catch(error => {
          console.error('Automatic token refresh failed:', error);
        });
      }
    }, 5 * 60 * 1000); // 5 minutes

    // Check token on page focus
    window.addEventListener('focus', () => {
      const token = this.getToken();
      if (token && this.isTokenExpired(token)) {
        console.log('Page focused and token is expired, refreshing...');
        this.refreshToken().catch(error => {
          console.error('Token refresh on focus failed:', error);
        });
      }
    });
  }

  // Get time until token expires (in minutes)
  getTimeUntilExpiration() {
    const token = this.getToken();
    if (!token) return 0;

    const expiration = this.getTokenExpiration(token);
    if (!expiration) return 0;

    const now = new Date();
    const diffMs = expiration.getTime() - now.getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60)));
  }
}

// Create singleton instance
const tokenManager = new TokenManager();
export default tokenManager;
