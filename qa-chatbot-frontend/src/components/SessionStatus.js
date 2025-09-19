// qa-chatbot-frontend/src/components/SessionStatus.js
import React, { useState, useEffect } from 'react';
import tokenManager from '../utils/tokenManager';

const SessionStatus = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeUntilExpiry, setTimeUntilExpiry] = useState(null);

  useEffect(() => {
    const handleTokenRefreshing = () => {
      setIsRefreshing(true);
    };

    const handleTokenRefreshed = () => {
      setIsRefreshing(false);
    };

    const handleSessionExpired = () => {
      setIsRefreshing(false);
    };

    window.addEventListener('tokenRefreshing', handleTokenRefreshing);
    window.addEventListener('tokenRefreshed', handleTokenRefreshed);
    window.addEventListener('sessionExpired', handleSessionExpired);

    // Update time until expiry every minute
    const updateTimer = () => {
      const minutes = tokenManager.getTimeUntilExpiration();
      setTimeUntilExpiry(minutes);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => {
      window.removeEventListener('tokenRefreshing', handleTokenRefreshing);
      window.removeEventListener('tokenRefreshed', handleTokenRefreshed);
      window.removeEventListener('sessionExpired', handleSessionExpired);
      clearInterval(interval);
    };
  }, []);

  if (isRefreshing) {
    return (
      <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        <span className="text-sm">Refreshing session...</span>
      </div>
    );
  }

  // Show warning when session is about to expire (less than 30 minutes)
  if (timeUntilExpiry !== null && timeUntilExpiry < 30 && timeUntilExpiry > 0) {
    return (
      <div className="fixed top-4 right-4 bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
        <span className="text-sm">
          Session expires in {timeUntilExpiry} minutes
        </span>
      </div>
    );
  }

  return null;
};

export default SessionStatus;
