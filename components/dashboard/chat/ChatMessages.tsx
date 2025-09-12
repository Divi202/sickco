import { motion, AnimatePresence } from 'framer-motion';
import AIResponse from './AIResponse';
import WelcomeMessage from './WelcomeMessage';
import { ChatMessagesProps } from '@/types/dashboard.types';

const ChatMessages: React.FC<ChatMessagesProps> = ({
  userMessages,
  isLoading,
  error,
  messagesEndRef,
  aiResponses,
}) => (
  // console.log('AI Response in ChatMessages:', aiResponse),
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
    {/* Show WelcomeMessage if no messages */}
    {userMessages.length === 0 && <WelcomeMessage />}

    {/* User and AI responses */}
    <AnimatePresence>
      {userMessages.map((message, index) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* User Message */}
          <div className="flex justify-end">
            <div className="flex items-start gap-2 md:gap-3 max-w-xs sm:max-w-sm md:max-w-md flex-row-reverse">
              {/* User Avatar */}
              <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-green-600/90 flex items-center justify-center">
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
              </div>
              {/* Message Bubble */}
              <div className="px-3 md:px-4 py-2 md:py-3 rounded-2xl shadow-lg bg-green-600/90 text-white rounded-br-sm">
                <p className="text-xs md:text-sm leading-relaxed">{message.text}</p>
                <p className="text-xs mt-1 md:mt-2 text-green-100">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* AI Response */}
          {aiResponses[index] && <AIResponse aiResponse={aiResponses[index]} />}
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
