import React from 'react';
import { MessageSquare, BarChart3, User, Mail, Settings } from 'lucide-react';

const ConversationCard = ({ conversation, index }) => {
  const getSafeUsername = (username) => username || 'Unknown User';

  return (
    <div className="p-6 hover:bg-gray-50 transition-all duration-200" style={{ animationDelay: `${index * 0.05}s` }}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-indigo-600 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            {conversation.title || 'Untitled Conversation'}
          </h4>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200">
            <BarChart3 className="w-4 h-4 mr-1" />
            {conversation.messages?.length || 0} messages
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              {getSafeUsername(conversation.user?.username)}
            </span>
            <span className="flex items-center">
              <Mail className="w-4 h-4 mr-1" />
              {conversation.user?.email || 'No email'}
            </span>
          </div>
          <span className="flex items-center text-gray-500">
            <Settings className="w-4 h-4 mr-1" />
            {conversation.createdAt ? new Date(conversation.createdAt).toLocaleString() : 'Unknown'}
          </span>
        </div>
        
        {conversation.messages?.length > 0 && (
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-gray-800">Last message:</span> 
              <span className="ml-2">{conversation.messages[conversation.messages.length - 1]?.prompt?.substring(0, 150) || 'No content'}...</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationCard;