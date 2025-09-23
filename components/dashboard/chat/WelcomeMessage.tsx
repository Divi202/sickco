import { motion } from 'framer-motion';

type WelcomeVariant = 'default' | 'cleared';

const WelcomeMessage = ({ variant = 'default' }: { variant?: WelcomeVariant }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center p-6 bg-gradient-to-b from-slate-800/70 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/30 shadow-xl"
  >
    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-full flex items-center justify-center border border-teal-500/30">
      <svg
        width="32"
        height="32"
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
    <h2 className="text-xl font-bold text-white mb-2 tracking-wide">Hi there, I’m SickCo 👋</h2>
    {variant === 'cleared' ? (
      <>
        <p className="text-slate-300/90 max-w-md mx-auto leading-relaxed">
          All set for a fresh start.
        </p>
        <p className="text-slate-300/90 max-w-md mx-auto leading-relaxed">
          Want to share how you’re feeling now?
        </p>
      </>
    ) : (
      <>
        <p className="text-slate-300/90 max-w-md mx-auto leading-relaxed">
          I&apos;m your Sickness Companion.
        </p>
        <p className="text-slate-300/90 max-w-md mx-auto leading-relaxed">
          Glad you’re here! How are you feeling today?
        </p>
      </>
    )}
  </motion.div>
);
export default WelcomeMessage;
