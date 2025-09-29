import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChatInputProps } from '@/types/dashboard.types';

const ChatInput: React.FC<ChatInputProps> = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
  isLoading,
}) => {
  const [showEmptyInputWarning, setShowEmptyInputWarning] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const max = 128; // 32 * 4
    const next = Math.min(el.scrollHeight, max);
    el.style.height = next + 'px';
    el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden';
  };

  useEffect(() => {
    resizeTextarea();
  }, [newMessage]);

  const handleSendClick = (e?: React.FormEvent) => {
    if (!newMessage.trim()) {
      setShowEmptyInputWarning(true);
      setTimeout(() => {
        setShowEmptyInputWarning(false);
      }, 1000);
      return;
    }
    handleSendMessage(e);
    // Reset textarea size after sending
    const el = textareaRef.current;
    if (el) {
      el.style.height = '44px';
      el.style.overflowY = 'hidden';
    }
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="bg-slate-800/30 border-t border-slate-700/50 backdrop-blur-sm p-3 md:p-6"
    >
      {/* className="bg-slate-800/30 border-t border-slate-700/50 backdrop-blur-sm p-3 md:p-6"
  >
    <div className="flex gap-2 md:gap-3">
      <textarea
        ref={textareaRef}
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type your message to Sickco..."
        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendClick(e)}
        className={`flex-1 bg-slate-700/50 border rounded-lg px-3 md:px-4 py-2 md:py-3 text-white placeholder-slate-400 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition-all duration-200 text-sm md:text-base resize-none min-h-[44px] max-h-32 overflow-y-hidden custom-scrollbar ${
          showEmptyInputWarning 
            ? 'border-red-500/70 animate-pulse' 
            : 'border-slate-600/50'
        }`}
        rows={1}
        style={{
          height: 'auto',
          minHeight: '44px',
        }}
        onInput={resizeTextarea}
      /> */}

      <div className="flex gap-2 md:gap-3">
        <textarea
          ref={textareaRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message to Sickco..."
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendClick(e)}
          className={`flex-1 bg-slate-700/50 border rounded-lg px-3 md:px-4 py-2 md:py-3 text-white placeholder-slate-400 
          focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 
          transition-all duration-200 text-sm md:text-base resize-none min-h-[44px] max-h-32 
          overflow-y-hidden custom-scrollbar ${
            showEmptyInputWarning ? 'border-red-500/70 animate-pulse' : 'border-slate-600/50'
          }`}
          rows={1}
          style={{
            height: 'auto',
            minHeight: '44px',
          }}
          onInput={resizeTextarea}
        />
        <motion.button
          onClick={handleSendClick}
          disabled={!newMessage.trim() || isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={showEmptyInputWarning ? { x: [-2, 2, -2, 2, 0] } : {}}
          transition={{ duration: 0.3 }}
          className="self-center bg-green-600/90 hover:bg-green-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-4 md:px-6 py-2 md:py-3 rounded-lg flex items-center gap-1 md:gap-2 transition-all duration-200 font-medium text-sm md:text-base"
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
  );
};

export default ChatInput;
