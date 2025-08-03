import React from 'react';
import { BarChart3, Users, MessageSquare } from 'lucide-react';

const TabNavigation = ({ activeTab, setActiveTab, isPageLoaded }) => {
  const tabs = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'users', label: 'Users', icon: Users },
    { key: 'conversations', label: 'Conversations', icon: MessageSquare }
  ];

  return (
    <div className={`mb-8 transition-all duration-700 delay-100 ease-out ${
      isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <nav className="flex space-x-8 bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-2 border border-white border-opacity-20">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center space-x-2 py-3 px-6 rounded-xl font-medium text-sm transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default TabNavigation;