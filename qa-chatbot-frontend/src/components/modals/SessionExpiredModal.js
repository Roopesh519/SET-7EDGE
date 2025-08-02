// qa-chatbot-frontend/src/components/modals/SessionExpiredModal.jsx
import React, { useState, useEffect } from 'react';

const SessionExpiredModal = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleSessionExpired = () => {
      setIsVisible(true);
    };

    window.addEventListener('sessionExpired', handleSessionExpired);
    return () => window.removeEventListener('sessionExpired', handleSessionExpired);
  }, []);

  const handleLoginRedirect = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-4 border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-4">Session Expired</h3>
        <p className="text-gray-300 mb-6">
          Your session has expired. Please log in again to continue.
        </p>
        <div className="flex justify-end">
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