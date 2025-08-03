import React from 'react';

const StatsCard = ({ title, value, icon: Icon, gradient, bg, border, index }) => {
  return (
    <div 
      className={`bg-gradient-to-r ${bg} p-6 rounded-2xl border ${border} hover:shadow-xl hover:scale-105 transition-all duration-300`} 
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 bg-gradient-to-r ${gradient} rounded-xl shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;