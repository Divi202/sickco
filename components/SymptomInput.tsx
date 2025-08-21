// src/components/SymptomInput.tsx

// ... (existing imports)
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';
import ExampleSuggestions from './ExampleSuggestions';

interface SymptomInputProps {
  // onSubmit?: (symptoms: string) => void; // This prop will no longer be directly used for submission
}

export default function SymptomInput({}: SymptomInputProps) {
  // Removed onSubmit prop
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleExampleClick = (example: string) => {
    setSymptoms(example);
  };

  const handleSubmit = async () => {
    if (!symptoms.trim()) {
      setError('Please describe your symptoms.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/health/symptoms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms: symptoms.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit symptoms.');
      }

      const result = await response.json();
      console.log('Symptoms submitted successfully:', result);
      setSuccessMessage(`Symptoms submitted! Entry ID: ${result.id}`);
      setSymptoms(''); // Clear the input field
    } catch (err: any) {
      console.error('Error submitting symptoms:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

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

          {/* Generate Button */}
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
                  <Send className="w-4 h-4 mr-2" />
                  Generate Plan
                </>
              )}
            </Button>
          </motion.div>
        </div>
        {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
        {successMessage && <p className="text-green-400 mt-4 text-center">{successMessage}</p>}
      </div>

      {/* Pass the example click handler */}
      <div className="mt-12">
        <ExampleSuggestions onExampleClick={handleExampleClick} />
      </div>
    </motion.div>
  );
}
