// qa-chatbot-frontend/src/components/modals/SessionExpiredModal.jsx
import React, { useState, useEffect } from 'react';
import tokenManager from '../../utils/tokenManager';

const SessionExpiredModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const handleSessionExpired = () => {
      setIsVisible(true);
    };

    const handleTokenRefreshed = () => {
      setIsVisible(false);
    };

    window.addEventListener('sessionExpired', handleSessionExpired);
    window.addEventListener('tokenRefreshed', handleTokenRefreshed);
    
    return () => {
      window.removeEventListener('sessionExpired', handleSessionExpired);
      window.removeEventListener('tokenRefreshed', handleTokenRefreshed);
    };
  }, []);

  const handleLoginRedirect = () => {
    tokenManager.clearToken();
    window.location.href = '/login';
  };

  const handleRetryRefresh = async () => {
    setIsRefreshing(true);
    try {
      await tokenManager.refreshToken();
      // If successful, the tokenRefreshed event will close the modal
    } catch (error) {
      console.error('Manual refresh failed:', error);
      // Modal will remain open for user to login
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-4 border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-4">Session Expired</h3>
        <p className="text-gray-300 mb-6">
          Your session has expired. We'll try to refresh it automatically, or you can log in again to continue.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleRetryRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRefreshing ? 'Refreshing...' : 'Try Again'}
          </button>
          <button
            onClick={handleLoginRedirect}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiredModal;