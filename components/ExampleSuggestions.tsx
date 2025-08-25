/**
 * ExampleSuggestions Component
 *
 * A user interface component that displays clickable example health conditions
 * and symptoms to help users get started with the symptom input process.
 * 
 * This component improves user experience by providing common symptom examples
 * that users can click to quickly populate the main input field, reducing
 * friction and providing guidance on the expected input format.
 * 
 * Features:
 * - Grid layout of example symptom descriptions
 * - Smooth animations using Framer Motion
 * - Responsive design for different screen sizes
 * - Hover and tap interactions
 * - Customizable example suggestions
 * - Callback integration with parent components
 * 
 * @component
 */

"use client";

import { motion } from "framer-motion";

/**
 * Props interface for the ExampleSuggestions component
 * 
 * @interface ExampleSuggestionsProps
 */
interface ExampleSuggestionsProps {
  /** 
   * Callback function triggered when a user clicks on an example
   * Receives the selected example text as a parameter
   */
  onExampleClick?: (example: string) => void;
}

/**
 * Predefined example symptom descriptions
 * 
 * These examples are carefully chosen to represent common health scenarios
 * that users might want to analyze. They provide guidance on the level of
 * detail expected and cover various types of health conditions.
 */
const examples = [
  "I have a cold and sore throat",
  "Recovering from stomach flu",
  "Managing diabetes symptoms",
  "Dealing with migraine headaches",
];

/**
 * ExampleSuggestions Component
 * 
 * Renders a grid of clickable example symptom descriptions that users can
 * select to quickly populate the main symptom input field. Each example
 * is presented as an interactive card with smooth animations.
 * 
 * @param {ExampleSuggestionsProps} props - Component properties
 * @param {Function} [props.onExampleClick] - Callback for when an example is clicked
 * @returns {JSX.Element} The rendered example suggestions interface
 * 
 * @example
 * ```tsx
 * <ExampleSuggestions 
 *   onExampleClick={(example) => setSymptoms(example)}
 * />
 * ```
 */
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
