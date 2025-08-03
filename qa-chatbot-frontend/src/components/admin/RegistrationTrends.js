import React from 'react';
import { Users } from 'lucide-react';

const RegistrationTrends = ({ data }) => {
  const maxCount = Math.max(...data.map(t => t.count));

  return (
    <div className="bg-white bg-opacity-90 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-white border-opacity-20 hover:shadow-2xl transition-all duration-300">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <Users className="w-5 h-5 mr-3 text-green-500" />
        Registration Trends (30 days)
      </h3>
      <div className="h-64 flex items-end space-x-1">
        {data.map((trend, index) => (
          <div key={trend._id} className="flex-1 flex flex-col items-center group">
            <div
              className="bg-gradient-to-t from-green-500 to-emerald-400 w-full rounded-t-lg transition-all duration-1000 ease-out hover:from-green-600 hover:to-emerald-500 group-hover:scale-110"
              style={{
                height: `${Math.max((trend.count / maxCount) * 200, 8)}px`,
                animationDelay: `${index * 0.05}s`
              }}
            ></div>
            <span className="text-xs text-gray-600 mt-2 transform rotate-45 origin-left whitespace-nowrap">
              {new Date(trend._id).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegistrationTrends;