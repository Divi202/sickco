import { motion } from 'framer-motion';

// New Welcome component
const WelcomeMessage = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center p-6 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50"
  >
    <div className="w-16 h-16 mx-auto mb-4 bg-slate-700 rounded-full flex items-center justify-center">
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-green-400"
      >
        <path d="M12 8V4H8" />
        <rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M2 14h2" />
        <path d="M20 14h2" />
        <path d="M15 13v2" />
        <path d="M9 13v2" />
      </svg>
    </div>
    <h2 className="text-xl font-bold text-white mb-2">Welcome to Sicko AI</h2>
    <p className="text-slate-300 max-w-md mx-auto">
      I&apos;m here to help you understand your symptoms and provide general health information. How
      can I assist you today?
    </p>
  </motion.div>
);
export default WelcomeMessage;
