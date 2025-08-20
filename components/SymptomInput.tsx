/**
 * SymptomInput Component
 *
 * Main input interface for users to describe their health symptoms or conditions.
 * Features a large textarea with placeholder text and a generate plan button.
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { motion } from "framer-motion";
import ExampleSuggestions from "./ExampleSuggestions";

interface SymptomInputProps {
  onSubmit?: (symptoms: string) => void;
}

export default function SymptomInput({ onSubmit }: SymptomInputProps) {
  const [symptoms, setSymptoms] = useState("");

  const handleExampleClick = (example: string) => {
    setSymptoms(example);
  };

  const handleSubmit = () => {
    if (symptoms.trim() && onSubmit) {
      onSubmit(symptoms.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
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
              disabled={!symptoms.trim()}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 px-6 py-3 h-auto rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4 mr-2" />
              Generate Plan
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Pass the example click handler */}
      <div className="mt-12">
        <ExampleSuggestions onExampleClick={handleExampleClick} />
      </div>
    </motion.div>
  );
}
