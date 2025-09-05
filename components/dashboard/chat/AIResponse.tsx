import React from 'react';
import { motion } from 'framer-motion';
import { SickCoAIResponseDTO } from '@/modules/ai/ai.schema';

interface AIResponseProps {
  aiResponse: SickCoAIResponseDTO;
}

const AIResponse: React.FC<AIResponseProps> = ({ aiResponse }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="mt-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl text-slate-200"
  >
    {/* <h3 className="text-xl font-semibold mb-4 text-slate-100">AI Analysis:</h3> */}
    <p className="mb-4">{aiResponse.empathy}</p>
    {aiResponse.disclaimer && aiResponse.information.length > 0 && (
      <>
        {/* <h4 className="text-lg font-medium mb-2 text-slate-300">Recommendations:</h4> */}
        <p className="mb-4">{aiResponse.information}</p>
        <p className="mb-4">{aiResponse.followUpQuestion}</p>

        <p className="text-sm mb-2">Disclaimer</p>
        <hr />
        <p className="mb-4">{aiResponse.disclaimer} </p>

        {/* <ul className="list-disc list-inside pl-4">
          {aiResponse.information.map((rec, index) => (
            <li key={index} className="mb-1">
              {rec}
            </li>
          ))}
        </ul> */}
      </>
    )}
    {/* <p className="text-sm text-slate-400 mt-4">
      Urgency Level:{' '}
      <span
        className={`font-semibold ${aiResponse.urgencyLevel === 'emergency' ? 'text-red-500' : aiResponse.urgencyLevel === 'high' ? 'text-orange-400' : aiResponse.urgencyLevel === 'medium' ? 'text-yellow-300' : 'text-green-400'}`}
      >
        {aiResponse.urgencyLevel.toUpperCase()}
      </span>
    </p> */}
  </motion.div>
);

export default AIResponse;
