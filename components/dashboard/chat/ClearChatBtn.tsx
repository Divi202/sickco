'use client';

import type React from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

type ClearChatBtnProps = {
  onClearChat: () => void;
};

const ClearChatBtn: React.FC<ClearChatBtnProps> = ({ onClearChat }) => (
  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClearChat}
    title="Clear chat history"
    aria-label="Clear chat history"
    className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 border border-border rounded-md text-foreground/80 hover:text-foreground transition-colors duration-200 text-sm font-medium"
  >
    <Trash2 className="w-4 h-4" aria-hidden="true" />
    <span className="hidden sm:inline">Clear Chat</span>
  </motion.button>
);

export default ClearChatBtn;
