import React from 'react';
import { Users, MessageSquare, Mail, Plus, BarChart3 } from 'lucide-react';
import StatsCard from './StatsCard';
import TrialUsageChart from './TrialUsageChart';
import RegistrationTrends from './RegistrationTrends';

const OverviewTab = ({ analytics, isPageLoaded }) => {
  const statsData = [
    { 
      title: 'Total Users', 
      value: analytics.overview.totalUsers, 
      icon: Users, 
      gradient: 'from-blue-500 to-cyan-500',
      bg: 'from-blue-50 to-cyan-50',
      border: 'border-blue-200'
    },
    { 
      title: 'Conversations', 
      value: analytics.overview.totalConversations, 
      icon: MessageSquare, 
      gradient: 'from-green-500 to-emerald-500',
      bg: 'from-green-50 to-emerald-50',
      border: 'border-green-200'
    },
    { 
      title: 'Total Messages', 
      value: analytics.overview.totalMessages, 
      icon: Mail, 
      gradient: 'from-purple-500 to-pink-500',
      bg: 'from-purple-50 to-pink-50',
      border: 'border-purple-200'
    },
    { 
      title: 'New This Week', 
      value: analytics.overview.newUsersThisWeek, 
      icon: Plus, 
      gradient: 'from-yellow-500 to-orange-500',
      bg: 'from-yellow-50 to-orange-50',
      border: 'border-yellow-200'
    },
    { 
      title: 'Daily Active', 
      value: analytics.overview.dailyActiveUsers, 
      icon: BarChart3, 
      gradient: 'from-red-500 to-pink-500',
      bg: 'from-red-50 to-pink-50',
      border: 'border-red-200'
    }
  ];

  return (
    <div className={`space-y-8 transition-all duration-700 delay-200 ease-out ${
      isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statsData.map((stat, index) => (
          <StatsCard key={stat.title} {...stat} index={index} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TrialUsageChart data={analytics.trialUsageStats} totalUsers={analytics.overview.totalUsers} />
        <RegistrationTrends data={analytics.registrationTrends} />
      </div>
    </div>
  );
};

export default OverviewTab;