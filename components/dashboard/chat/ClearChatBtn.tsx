import React from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { ClearChatBtnProps } from '@/types/dashboard.types';

const ClearChatBtn: React.FC<ClearChatBtnProps> = ({ onClearChat }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClearChat}
    className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-600/70 border border-slate-600/50 hover:border-slate-500/70 rounded-lg text-slate-300 hover:text-white transition-all duration-200 text-sm font-medium"
    title="Clear chat history"
  >
    <Trash2 className="w-4 h-4" />
    <span className="hidden sm:inline">Clear Chat</span>
  </motion.button>
);

export default ClearChatBtn;