import { motion, AnimatePresence } from 'framer-motion';
import React, { RefObject } from 'react';
import AIResponse from './AIResponse';
import { SickCoAIResponseDTO } from '@/modules/ai/ai.schema';

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
  aiResponse: SickCoAIResponseDTO | null;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading,
  error,
  messagesEndRef,
  aiResponse,
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
      {messages.map((message, index) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Regular chat bubble for user messages and initial AI response */}
          {(message.sender === 'user' || index === 0) && (
            <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`flex items-start gap-2 md:gap-3 max-w-xs sm:max-w-sm md:max-w-md ${
                  message.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                {/* Avatar - keep existing avatar code */}
                <div className={`flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full...`}>
                  {/* Keep existing avatar SVGs */}
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
            </div>
          )}

          {/* Structured AI Response for non-initial AI messages */}
          {message.sender === 'sicko' && index !== 0 && (
            <div className="mt-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                {/* AI Avatar */}
                <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-white"
                  >
                    <path d="M12 8V4H8" />
                    <rect width="16" height="12" x="4" y="8" rx="2" />
                    <path d="M2 14h2" />
                    <path d="M20 14h2" />
                    <path d="M15 13v2" />
                    <path d="M9 13v2" />
                  </svg>
                </div>
                <span className="text-slate-200 font-medium">Sicko AI</span>
              </div>

              <div className="space-y-3 text-sm md:text-base">
                <div className="prose prose-invert max-w-none">
                  {message.text.split('\n').map((line, i) => (
                    <p key={i} className="mb-2 text-slate-200">
                      {line}
                    </p>
                  ))}
                </div>
                <p className="text-xs text-slate-400">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </AnimatePresence>
    {/* Loading State */}
    {isLoading && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-start"
      >
        <div className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-600 animate-pulse" />
            <div className="h-4 w-24 bg-slate-600 rounded animate-pulse" />
          </div>
          <div className="mt-3 space-y-2">
            <div className="h-4 w-3/4 bg-slate-600 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-slate-600 rounded animate-pulse" />
          </div>
        </div>
      </motion.div>
    )}

    {/* Error Message */}
    {error && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center"
      >
        {error}
      </motion.div>
    )}
  </div>
);

export default ChatMessages;
