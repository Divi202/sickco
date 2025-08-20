/**
 * ExampleSuggestions Component
 *
 * Displays clickable example health conditions/symptoms that users can select
 * to quickly populate the main input field.
 */

"use client";

import { motion } from "framer-motion";

interface ExampleSuggestionsProps {
  onExampleClick?: (example: string) => void;
}

const examples = [
  "I have a cold and sore throat",
  "Recovering from stomach flu",
  "Managing diabetes symptoms",
  "Dealing with migraine headaches",
];

export default function ExampleSuggestions({
  onExampleClick,
}: ExampleSuggestionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-4xl mx-auto px-6"
    >
      {/* Try these examples text */}
      <div className="text-center mb-6">
        <p className="text-slate-400 text-lg font-medium">
          Try these examples:
        </p>
      </div>

      {/* Example pills grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {examples.map((example, index) => (
          <motion.button
            key={example}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            whileHover={{
              scale: 1.02,
              backgroundColor: "rgba(71, 85, 105, 0.8)",
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onExampleClick?.(example)}
            className="bg-slate-700/60 hover:bg-slate-600/80 text-slate-200 px-6 py-4 rounded-2xl border border-slate-600/50 transition-all duration-200 text-left font-medium backdrop-blur-sm"
          >
            {example}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
