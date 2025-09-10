import { motion } from 'framer-motion';
import { ChatHeaderProps } from '@/types/dashboard.types';

const ChatHeader: React.FC<ChatHeaderProps> = ({ onToggleMobileMenu }) => (
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
        <p className="text-slate-400 text-xs md:text-sm mt-1">AI-powered conversation assistant</p>
      </div>
    </div>
  </motion.div>
);

export default ChatHeader;
