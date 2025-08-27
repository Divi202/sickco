/**
 * Chat Component - Handles all chat functionality including messages and input
 * Props: onToggleMobileMenu
 */
'use client';
import { useState, useEffect, useRef } from 'react'; // Import useEffect and useRef
import { motion, AnimatePresence } from 'framer-motion';
import { AIAnalysisResponse } from '@/modules/ai/models/AIResponse'; // Import AIAnalysisResponse

interface ChatProps {
  onToggleMobileMenu: () => void;
  initialMessage?: string; // Add initialMessage prop
}

const Chat: React.FC<ChatProps> = ({ onToggleMobileMenu, initialMessage }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey there! I'm Sicko, your AI assistant. How can I help you today?",
      sender: 'sicko',
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const [error, setError] = useState<string | null>(null); // New state for errors
  const [aiResponse, setAiResponse] = useState<AIAnalysisResponse | null>(null); // New state for AI response

  const messagesEndRef = useRef<HTMLDivElement>(null); // Create a ref for the messages container

  // Effect to pre-fill message if initialMessage is provided
  useEffect(() => {
    if (initialMessage) {
      setNewMessage(initialMessage);
    }
  }, [initialMessage]);

  // Effect to scroll to the bottom of the chat whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle sending new message
  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    if (!newMessage.trim()) return;

    const userMessageText = newMessage.trim();

    // Add user message to chat
    const userMessage = {
      id: messages.length + 1,
      text: userMessageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage(''); // Clear input immediately

    setIsLoading(true);
    setError(null);
    setAiResponse(null); // Clear previous AI response

    try {
      const response = await fetch('/api/health/symptoms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms: userMessageText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit symptoms.');
      }

      const result = await response.json();
      console.log('Symptoms submitted successfully:', result);
      setAiResponse(result.aiAnalysis);

      // Add AI response to chat messages
      // Note: The ID calculation here might be slightly off if messages state updates
      // are not immediate. For a robust solution, consider using a unique ID generator.
      const sickoResponse = {
        id: messages.length + 2,
        text: `Here's the analysis for "${userMessageText}":\n\n${result.aiAnalysis.analysis}`,
        sender: 'sicko',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, sickoResponse]);
    } catch (err: any) {
      console.error('Error submitting symptoms:', err);
      setError(err.message || 'An unexpected error occurred.');
      // Add an error message to the chat if the API call fails
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: `Error: ${err.message || 'Failed to get AI analysis.'}`,
          sender: 'sicko',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
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
                <p className="text-xs md:text-sm leading-relaxed">Sicko is typing...</p>
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

        {/* Display AI Response */}
        {aiResponse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl text-slate-200"
          >
            <h3 className="text-xl font-semibold mb-4 text-slate-100">AI Analysis:</h3>
            <p className="mb-4">{aiResponse.analysis}</p>
            {aiResponse.recommendations && aiResponse.recommendations.length > 0 && (
              <>
                <h4 className="text-lg font-medium mb-2 text-slate-300">Recommendations:</h4>
                <ul className="list-disc list-inside pl-4">
                  {aiResponse.recommendations.map((rec, index) => (
                    <li key={index} className="mb-1">
                      {rec}
                    </li>
                  ))}
                </ul>
              </>
            )}
            <p className="text-sm text-slate-400 mt-4">
              Urgency Level:{' '}
              <span
                className={`font-semibold ${aiResponse.urgencyLevel === 'emergency' ? 'text-red-500' : aiResponse.urgencyLevel === 'high' ? 'text-orange-400' : aiResponse.urgencyLevel === 'medium' ? 'text-yellow-300' : 'text-green-400'}`}
              >
                {aiResponse.urgencyLevel.toUpperCase()}
              </span>
            </p>
          </motion.div>
        )}
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
            disabled={!newMessage.trim() || isLoading}
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
