import React from 'react';
import ConversationCard from './ConversationCard';

const ConversationList = ({ conversations }) => {
  return (
    <div className="bg-white bg-opacity-90 backdrop-blur-md shadow-xl rounded-2xl border border-white border-opacity-20 overflow-hidden">
      <div className="divide-y divide-gray-200">
        {conversations.map((conversation, index) => (
          <ConversationCard
            key={conversation._id}
            conversation={conversation}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default ConversationList;