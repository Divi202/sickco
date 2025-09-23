import { motion, AnimatePresence } from 'framer-motion';
import AIResponse from './AIResponse';
import WelcomeMessage from './WelcomeMessage';
import { ChatMessagesProps } from '@/types/dashboard.types';

const ChatMessages: React.FC<ChatMessagesProps> = ({
  conversation,
  messagesEndRef,
  isHistoryLoading,
  isClearingChat,
  wasCleared,
}) => {
  return (
    <div
      ref={messagesEndRef} // Attach the ref here
      className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4 custom-scrollbar"
    >
      {/* Show skeleton loader while loading history */}
      {isHistoryLoading && conversation.length === 0 && (
        <div>
          {/* Skeleton message bubbles */}
          {[1, 2, 3].map((index) => (
            <div key={index} className="animate-pulse">
              <div className="flex justify-start">
                <div className="flex items-start gap-3 max-w-md">
                  <div className="w-8 h-8 rounded-full bg-slate-600/50" />
                  <div className="bg-slate-700/50 rounded-xl p-4 space-y-2">
                    <div className="h-4 bg-slate-600/50 rounded w-48" />
                    <div className="h-4 bg-slate-600/50 rounded w-32" />
                    <div className="h-4 bg-slate-600/50 rounded w-24" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isHistoryLoading && conversation.length === 0 && (
        <WelcomeMessage variant={wasCleared ? 'cleared' : 'default'} />
      )}

      {/* Conversation turns */}
      <AnimatePresence>
        {conversation.map((turn) => (
          <motion.div
            key={turn.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={isClearingChat ? 'animate-pulse opacity-50' : ''}
          >
            {/* User Message */}
            <div className="flex justify-end">
              <div className="flex items-start gap-2 md:gap-3 max-w-xs sm:max-w-sm md:max-w-md flex-row-reverse">
                {/* User Name */}
                <div className="flex flex-col items-end">
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
                  <span className="text-xs text-slate-400 mt-1 font-medium">You</span>
                </div>
                {/* Message Bubble */}
                <div className="px-3 md:px-4 py-2 md:py-3 rounded-2xl shadow-lg bg-green-600/90 text-white rounded-br-sm">
                  <p className="text-xs md:text-sm leading-relaxed">{turn.userMessage.text}</p>
                  <p className="text-xs mt-1 md:mt-2 text-green-100">
                    {turn.userMessage.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* AI Response or Loading/Error State */}
            {turn.isLoadingAI && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex justify-start mt-4"
              >
                <div className="flex items-start gap-3 max-w-md">
                  <div className="flex flex-col items-start">
                    {/* AI Avatar */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/30 flex items-center justify-center">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-teal-400"
                      >
                        <path d="M12 8V4H8" />
                        <rect width="16" height="12" x="4" y="8" rx="2" />
                        <path d="M2 14h2" />
                        <path d="M20 14h2" />
                        <path d="M15 13v2" />
                        <path d="M9 13v2" />
                      </svg>
                    </div>
                    <span className="text-xs text-slate-400 mt-1 font-medium">SickCo</span>
                  </div>

                  {/* Typing indicator bubble */}
                  <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/30 rounded-xl rounded-tl-sm px-4 py-3 shadow-lg">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-300 text-sm mr-2">Sickco is typing</span>
                      <div className="flex gap-1">
                        <div
                          className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
                          style={{ animationDelay: '0ms' }}
                        />
                        <div
                          className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
                          style={{ animationDelay: '150ms' }}
                        />
                        <div
                          className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
                          style={{ animationDelay: '300ms' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {turn.errorAI && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center"
              >
                {turn.errorAI}
              </motion.div>
            )}

            {turn.aiResponse && <AIResponse aiResponse={turn.aiResponse} />}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ChatMessages;
