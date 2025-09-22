import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AIResponseProps } from '@/types/dashboard.types';

const AIResponse: React.FC<AIResponseProps> = ({ aiResponse }) => (
  <div className="flex justify-start mt-4">
    <div className="flex items-start gap-3 max-w-4xl">
      <div className="flex flex-col items-start">
      {/* AI Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/30 flex items-center justify-center">
        <svg
          width="16"
          height="16"
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
        <span className="text-xs text-slate-400 mt-1 font-medium">SickCo</span>
      </div>

      {/* AI Response Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/30 rounded-xl rounded-tl-sm p-5 shadow-lg"
      >
        {/* Empathy (lead-in) */}
        {aiResponse.empathy && (
          <div className="text-slate-300/90 italic">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiResponse.empathy}</ReactMarkdown>
          </div>
        )}

        {/* Information (primary content) */}
        {aiResponse.information && aiResponse.information.length > 0 && (
          <div className={`markdown-content ${aiResponse.empathy ? 'mt-4' : ''} text-slate-200`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiResponse.information}</ReactMarkdown>
          </div>
        )}

        {/* Disclaimer (footnote style) */}
        {aiResponse.disclaimer && (
          <div className="mt-4 flex itmes-center gap-2">
            <div className=" flex flex-col gap-2 text-xs text-slate-400 p-2 rounded border-l-2 border-gray-300">
              <strong>Disclaimer</strong>{' '}
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiResponse.disclaimer}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Follow-up question (inline, subtle) */}
        {aiResponse.followUpQuestion && (
          <div className="mt-3 pt-3 border-t border-slate-700/30">
            <div className="text-slate-300/90">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {aiResponse.followUpQuestion}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  </div>
);

export default AIResponse;
