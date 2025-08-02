import React, { useState } from 'react';
import { Key, X, Settings, AlertCircle, ExternalLink } from 'lucide-react';

const ApiKeyModal = ({ isOpen, onClose, onNavigateToSettings }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">API Key Required</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Key className="w-8 h-8 text-indigo-500" />
            </div>
            <p className="text-gray-600 mb-2 leading-relaxed">
              To start chatting, you need to configure your Together.ai API key in settings.
            </p>
            <p className="text-sm text-gray-500">
              This ensures you have access to the AI models and can enjoy unlimited conversations.
            </p>
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Why configure your API key?
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Higher rate limits and priority access
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Better performance and reliability
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Direct billing to your account
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={onNavigateToSettings}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:from-indigo-600 hover:to-purple-700 hover:scale-[1.02] flex items-center justify-center space-x-2"
            >
              <Settings className="w-5 h-5" />
              <span>Go to Settings</span>
            </button>
            
            <div className="text-center">
              <a
                href="https://api.together.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                <span>Get your API key from Together.ai</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <button
              onClick={onClose}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium transition-all duration-200 hover:bg-gray-50 hover:border-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;