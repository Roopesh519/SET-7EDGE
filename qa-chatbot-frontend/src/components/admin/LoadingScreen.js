import React from 'react';
import { Shield } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <p className="text-lg animate-pulse">Loading admin dashboard...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;