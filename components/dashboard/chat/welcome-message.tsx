'use client';

import { motion } from 'framer-motion';

type WelcomeVariant = 'default' | 'cleared';

const WelcomeMessage = ({ variant = 'default' }: { variant?: WelcomeVariant }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center p-6 bg-card border border-border rounded-xl shadow-sm"
  >
    <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex  items-center justify-center border border-border">
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-foreground"
      >
        <path d="M12 8V4H8" />
        <rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M2 14h2" />
        <path d="M20 14h2" />
        <path d="M15 13v2" />
        <path d="M9 13v2" />
      </svg>
    </div>
    <h2 className="text-xl font-semibold text-foreground mb-2 tracking-wide">
      Hi there, I’m SickCo 👋
    </h2>
    {variant === 'cleared' ? (
      <>
        <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
          All set for a fresh start.
        </p>
        <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
          Want to share how you’re feeling now?
        </p>
      </>
    ) : (
      <>
        <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
          I&apos;m your Sickness Companion.
        </p>
        <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
          Glad you’re here! How are you feeling today?
        </p>
      </>
    )}
  </motion.div>
);
export default WelcomeMessage;
