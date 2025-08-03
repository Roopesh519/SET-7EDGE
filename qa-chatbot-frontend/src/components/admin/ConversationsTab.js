import React from 'react';
import { MessageSquare, Download } from 'lucide-react';
import ConversationList from './ConversationList';
import Pagination from './Pagination';

const ConversationsTab = ({ 
  conversations, 
  conversationPage, 
  fetchConversations, 
  exportConversations, 
  isPageLoaded 
}) => {
  return (
    <div className={`space-y-6 transition-all duration-700 delay-200 ease-out ${
      isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      {/* Conversations Header */}
      <div className="flex justify-between items-center bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
        <div className="flex items-center space-x-3">
          <MessageSquare className="w-6 h-6 text-indigo-400" />
          <h2 className="text-xl font-semibold text-white">Conversations</h2>
        </div>
        <button
          onClick={exportConversations}
          className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <Download className="w-5 h-5" />
          <span>Export CSV</span>
        </button>
      </div>

      <ConversationList conversations={conversations.conversations || []} />

      <Pagination
        currentPage={conversations.currentPage}
        totalPages={conversations.totalPages}
        total={conversations.total}
        onPageChange={fetchConversations}
        itemName="conversations"
      />
    </div>
  );
};

export default ConversationsTab;