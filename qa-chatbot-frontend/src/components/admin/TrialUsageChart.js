import React from 'react';
import { BarChart3 } from 'lucide-react';

const TrialUsageChart = ({ data, totalUsers }) => {
  return (
    <div className="bg-white bg-opacity-90 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-white border-opacity-20 hover:shadow-2xl transition-all duration-300">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <BarChart3 className="w-5 h-5 mr-3 text-indigo-500" />
        Trial Usage Distribution
      </h3>
      <div className="space-y-4">
        {data.map((stat, index) => (
          <div key={stat._id} className="flex items-center space-x-4">
            <span className="w-24 text-sm font-medium text-gray-700">{stat._id} prompts:</span>
            <div className="flex-1">
              <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${(stat.count / totalUsers) * 100}%`,
                    animationDelay: `${index * 0.2}s`
                  }}
                ></div>
              </div>
            </div>
            <span className="text-sm font-semibold text-gray-600 min-w-[3rem] text-right">{stat.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrialUsageChart;