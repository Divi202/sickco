import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AIResponseProps } from '@/types/dashboard.types';

const AIResponse: React.FC<AIResponseProps> = ({ aiResponse }) => (
   <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="mt-4 bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/30 rounded-xl p-5 shadow-lg"
  >
    {/* Empathy (lead-in) */}
    {aiResponse.empathy && (
      <p className="text-slate-300/90 italic">{aiResponse.empathy}</p>
    )}

    {/* Information (primary content) */}
    {aiResponse.information && aiResponse.information.length > 0 && (
      <div className={`markdown-content ${aiResponse.empathy ? 'mt-4' : ''} text-slate-200`}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {aiResponse.information}
        </ReactMarkdown>
      </div>
    )}

    {/* Follow-up question (inline, subtle) */}
    {aiResponse.followUpQuestion && (
      <div className="mt-3 pt-3 border-t border-slate-700/30">
        <p className="text-slate-300/90">
          {aiResponse.followUpQuestion}
        </p>
      </div>
    )}

    {/* Disclaimer (footnote style) */}
    {aiResponse.disclaimer && (
      <div className="mt-4 flex itmes-center gap-2">
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-slate-500">
              <path fill="currentColor" d="M11 7h2v2h-2V7Zm0 4h2v6h-2v-6Zm1-8a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z"/>
            </svg>
        <span className="text-xs text-slate-400">
          
          Disclaimer — {aiResponse.disclaimer}
        </span>
      </div>
    )}
  </motion.div>
);

export default AIResponse;
