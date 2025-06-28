import { useState } from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import ChatBot from './ChatBot';

const ChatBotToggle = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatBot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={toggleChatBot}
          className={`group relative w-16 h-16 bg-gradient-to-r from-[#E50914] to-[#f6121d] hover:from-[#f6121d] hover:to-[#E50914] text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-label="Open AI Assistant"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#E50914] to-[#f6121d] opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
          
          <div className="relative flex items-center justify-center w-full h-full">
            {isOpen ? (
              <MessageCircle size={24} className="transform rotate-180" />
            ) : (
              <div className="relative">
                <MessageCircle size={24} />
                <Sparkles size={12} className="absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
              </div>
            )}
          </div>

          {/* Notification dot */}
          {!isOpen && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          )}

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-black/80 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            Ask AI for recommendations
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
          </div>
        </button>

        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-full bg-[#E50914] opacity-20 animate-ping pointer-events-none"></div>
      </div>

      {/* ChatBot Component */}
      <ChatBot isOpen={isOpen} onToggle={toggleChatBot} />
    </>
  );
};

export default ChatBotToggle;