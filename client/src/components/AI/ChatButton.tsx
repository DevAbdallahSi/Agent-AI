import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import OpenRouterChat from './OpenRouterChat';

const ChatButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all z-50 flex items-center justify-center group"
        >
          <MessageSquare className="h-6 w-6 group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <OpenRouterChat
            userId="current-user"
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            userName="You"
            aiName="AI Programming Tutor"
          />
        </div>
      )}
    </>
  );
};

export default ChatButton;