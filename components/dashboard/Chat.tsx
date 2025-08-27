/**
 * Chat Component - Handles all chat functionality including messages and input
 * Props: onToggleMobileMenu
 */
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatProps {
  onToggleMobileMenu: () => void;
}

const Chat: React.FC<ChatProps> = ({ onToggleMobileMenu }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey there! I'm Sicko, your AI assistant. How can I help you today?",
      sender: 'sicko',
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Handle sending new message
  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault?.();
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage('');

    // Simulate Sicko response after delay
    setTimeout(() => {
      const sickoResponse = {
        id: messages.length + 2,
        text: "Thanks for your message! I'm processing that for you...",
        sender: 'sicko',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, sickoResponse]);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Chat Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-800/30 border-b border-slate-700/50 backdrop-blur-sm px-4 md:px-6 py-3 md:py-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          {/* Mobile Hamburger Menu */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleMobileMenu}
            className="md:hidden text-slate-400 hover:text-white transition-colors"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </motion.button>

          <div>
            <h2 className="text-lg md:text-xl font-semibold text-white">Chat with Sicko</h2>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              AI-powered conversation assistant
            </p>
          </div>
        </div>
      </motion.div>

      {/* Chat Messages Area */}
      <div
        className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4 custom-scrollbar "
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgb(71, 85, 105) rgba(30, 41, 59, 0.5)',
        }}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(30, 41, 59, 0.5);
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgb(71, 85, 105);
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgb(100, 116, 139);
            }
          `,
          }}
        />
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-start gap-2 md:gap-3 max-w-xs sm:max-w-sm md:max-w-md ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'user' ? 'bg-green-600/90' : 'bg-slate-600'
                  }`}
                >
                  {message.sender === 'user' ? (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-white md:w-4 md:h-4"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  ) : (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-white md:w-4 md:h-4"
                    >
                      <path d="M12 8V4H8" />
                      <rect width="16" height="12" x="4" y="8" rx="2" />
                      <path d="M2 14h2" />
                      <path d="M20 14h2" />
                      <path d="M15 13v2" />
                      <path d="M9 13v2" />
                    </svg>
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`px-3 md:px-4 py-2 md:py-3 rounded-2xl shadow-lg ${
                    message.sender === 'user'
                      ? 'bg-green-600/90 text-white rounded-br-sm'
                      : 'bg-slate-700 text-slate-100 rounded-bl-sm'
                  }`}
                >
                  <p className="text-xs md:text-sm leading-relaxed">{message.text}</p>
                  <p
                    className={`text-xs mt-1 md:mt-2 ${
                      message.sender === 'user' ? 'text-green-100' : 'text-slate-400'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Message Input */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-slate-800/30 border-t border-slate-700/50 backdrop-blur-sm p-3 md:p-6"
      >
        <div className="flex gap-2 md:gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message to Sicko..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
            className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 md:px-4 py-2 md:py-3 text-white placeholder-slate-400 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition-all duration-200 text-sm md:text-base"
          />
          <motion.button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-600/90 hover:bg-green-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-4 md:px-6 py-2 md:py-3 rounded-lg flex items-center gap-1 md:gap-2 transition-all duration-200 font-medium text-sm md:text-base"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="md:w-[18px] md:h-[18px]"
            >
              <path d="M22 2L11 13" />
              <polygon points="22,2 15,22 11,13 2,9" />
            </svg>
            <span className="hidden sm:inline">Send</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
export default Chat;
