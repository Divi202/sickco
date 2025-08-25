// src/components/SymptomInput.tsx

// ... (existing imports)
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';
import ExampleSuggestions from './ExampleSuggestions';
import { AIAnalysisResponse } from '@/modules/ai/models/AIResponse'; // Import AI response type

export default function SymptomInput() {
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<AIAnalysisResponse | null>(null); // New state for AI response

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
    setAiResponse(null); // Clear previous AI response

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
        throw new Error(errorData.error || 'Failed to submit symptoms.');
      }

      const result = await response.json();
      console.log('Symptoms submitted successfully:', result);
      setAiResponse(result.aiAnalysis); // Set the AI response
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
      </div>

      {/* Display AI Response */}
      {aiResponse && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl text-slate-200"
        >
          <h3 className="text-xl font-semibold mb-4 text-slate-100">AI Analysis:</h3>
          <p className="mb-4">{aiResponse.analysis}</p>
          {aiResponse.recommendations && aiResponse.recommendations.length > 0 && (
            <>
              <h4 className="text-lg font-medium mb-2 text-slate-300">Recommendations:</h4>
              <ul className="list-disc list-inside pl-4">
                {aiResponse.recommendations.map((rec, index) => (
                  <li key={index} className="mb-1">{rec}</li>
                ))}
              </ul>
            </>
          )}
          <p className="text-sm text-slate-400 mt-4">Urgency Level: <span className={`font-semibold ${aiResponse.urgencyLevel === 'emergency' ? 'text-red-500' : aiResponse.urgencyLevel === 'high' ? 'text-orange-400' : aiResponse.urgencyLevel === 'medium' ? 'text-yellow-300' : 'text-green-400'}`}>{aiResponse.urgencyLevel.toUpperCase()}</span></p>
        </motion.div>
      )}

      {/* Pass the example click handler */}
      <div className="mt-12">
        <ExampleSuggestions onExampleClick={handleExampleClick} />
      </div>
    </motion.div>
  );
}