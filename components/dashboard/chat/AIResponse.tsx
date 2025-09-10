import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { AIResponseProps } from '@/types/dashboard.types';

const AIResponse: React.FC<AIResponseProps> = ({ aiResponse }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="mt-4 bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/30 rounded-xl p-5 shadow-lg"
  >
    <p className="text-slate-300/90 ">{aiResponse.empathy}</p>

    {aiResponse.disclaimer && aiResponse.information.length > 0 && (
      <>
        <div className="mt-4 text-slate-300/90 max-w-none">
          <ReactMarkdown>{aiResponse.information}</ReactMarkdown>
        </div>

        <p className="mt-4 text-slate-300/90 ">{aiResponse.followUpQuestion}</p>

        <div className="mt-4 pt-3 border-t border-slate-700/30">
          <p className="text-xs text-slate-300/90 mb-1">Disclaimer - {aiResponse.disclaimer}</p>
          {/* <p className="text-xs text-slate-300/90 "></p> */}
        </div>
      </>
    )}
  </motion.div>
);

export default AIResponse;
