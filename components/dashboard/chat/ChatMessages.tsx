import { motion, AnimatePresence } from 'framer-motion';
import React, { RefObject } from 'react';
import { AIAnalysisResponse } from '@/modules/ai/models/AIResponse';

interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: Date;
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  messagesEndRef: RefObject<HTMLDivElement | null>; // <-- Allow null here
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading,
  error,
  messagesEndRef,
}) => (
  <div
    ref={messagesEndRef} // Attach the ref here
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
            className={`flex items-start gap-2 md: gap-3 max-w-xs sm: max-w-sm md: max-w-md ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div
              className={`flex-shrink-0 w-6 h-6 md: w-8 md: h-8 rounded-full flex items-center justify-center ${
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
              className={`px-3 md: px-4 py-2 md: py-3 rounded-2xl shadow-lg ${
                message.sender === 'user'
                  ? 'bg-green-600/90 text-white rounded-br-sm'
                  : 'bg-slate-700 text-slate-100 rounded-bl-sm'
              }`}
            >
              <p className="text-xs md:text-sm leading-relaxed">{message.text}</p>
              <p
                className={`text-xs mt-1 md: mt-2 ${
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

    {isLoading && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-start"
      >
        <div className="flex items-start gap-2 md:gap-3 max-w-xs sm:max-w-sm md:max-w-md">
          <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center bg-slate-600">
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
          </div>
          <div className="px-3 md:px-4 py-2 md:py-3 rounded-2xl shadow-lg bg-slate-700 text-slate-100 rounded-bl-sm">
            <p className="text-xs md:text-sm leading-relaxed">...</p>
          </div>
        </div>
      </motion.div>
    )}

    {error && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-red-400 mt-4 text-center"
      >
        {error}
      </motion.div>
    )}
  </div>
);

export default ChatMessages;
