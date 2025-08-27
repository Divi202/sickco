/**
 * SymptomInput Component
 *
 * The main input interface for users to describe their health symptoms and receive
 * AI-powered analysis. This component handles user input, API communication, and
 * displays the AI response with proper loading and error states.
 *
 * Features:
 * - Large textarea for symptom description
 * - Real-time input validation
 * - Loading states during API calls
 * - Error handling and display
 * - AI response visualization
 * - Example suggestions for user guidance
 * - Keyboard shortcuts (Cmd/Ctrl + Enter to submit)
 * - Smooth animations using Framer Motion
 *
 * @component
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';
import ExampleSuggestions from './ExampleSuggestions';
import { useRouter } from 'next/navigation'; // Import useRouter

/**
 * SymptomInput Component
 *
 * Main component for symptom input and AI analysis display. Manages the entire
 * user flow from symptom description to AI response visualization.
 *
 * @returns {JSX.Element} The rendered symptom input interface
 */
export default function SymptomInput() {
  // State for user input
  const [symptoms, setSymptoms] = useState('');
  // Loading state for API calls (now for navigation)
  const [isLoading, setIsLoading] = useState(false);
  // Error state for displaying error messages
  const [error, setError] = useState<string | null>(null);

  const router = useRouter(); // Initialize useRouter

  /**
   * Handles clicking on example suggestions
   * Populates the textarea with the selected example text
   *
   * @param {string} example - The example text to populate in the input
   */
  const handleExampleClick = (example: string) => {
    setSymptoms(example);
  };

  /**
   * Handles form submission and navigation
   *
   * Validates input and navigates to the dashboard with symptoms as a query parameter.
   *
   * @async
   * @returns {Promise<void>}
   */

  const handleSubmit = async () => {
    if (!symptoms.trim()) {
      setError('Please describe your symptoms.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Redirect to dashboard with symptoms as a query parameter
      router.push(`/dashboard?symptoms=${encodeURIComponent(symptoms.trim())}`);
    } catch (err: any) {
      console.error('Error navigating:', err);
      setError(err.message || 'An unexpected error occurred during navigation.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles keyboard shortcuts for form submission
   * Allows users to submit using Cmd+Enter or Ctrl+Enter
   *
   * @param {React.KeyboardEvent} e - The keyboard event
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto p-6 mb-8"
    >
      {/* Main Input Container */}
      <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          {/* Textarea */}
          <div className="flex-1">
            <Textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your symptoms or health condition..."
              className="min-h-[120px] bg-transparent border-none text-slate-200 placeholder:text-slate-400 text-lg resize-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
            />
          </div>

          {/* Chat with Sicko Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleSubmit}
              disabled={!symptoms.trim() || isLoading}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 px-6 py-3 h-auto rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                'Submitting...'
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Chat with Sickco
                </>
              )}
            </Button>
          </motion.div>
        </div>
        {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
      </div>

      {/* Display AI Response - removed from here, now handle in chat.jsx*/}

      {/* Pass the example click handler */}
      <div className="mt-12">
        <ExampleSuggestions onExampleClick={handleExampleClick} />
      </div>
    </motion.div>
  );
}
