'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type AIResponseProps = {
  aiResponse: {
    empathy?: string;
    information?: string;
    disclaimer?: string;
    followUpQuestion?: string;
  };
};
// Custom components to handle emoji lists
const emojiList = {
  ul: ({ children, ...props }: any) => {
    // Check if any list item starts with common emojis used by AI
    const hasEmojiBullets = React.Children.toArray(children).some((child: any) => {
      if (child?.props?.children) {
        const text = child.props.children.toString();
        return /^(✅|❌|🚀|⚠️|📌|🔍|💡|🌟|⭐|📝|🔧|🎯|📊|🔔|📋|🚨|💊|🥗|💧|🌿|🏃|😴|💤)/.test(
          text.trim(),
        );
      }
      return false;
    });

    return (
      <ul className={`markdown-list ${hasEmojiBullets ? 'emoji-list' : ''}`} {...props}>
        {children}
      </ul>
    );
  },
  // You can also add ol handling if needed
  ol: ({ children, ...props }: any) => {
    return (
      <ol className="markdown-list" {...props}>
        {children}
      </ol>
    );
  },
};
const AIResponse: React.FC<AIResponseProps> = ({ aiResponse }) => (
  <div className="flex justify-start mt-4">
    <div className="flex items-start gap-3 max-w-4xl">
      {/* AI Response Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        // className="flex-1 bg-card rounded-md rounded-tl-sm p-5 shadow-sm"
      >
        {/* Empathy (lead-in) */}
        {aiResponse.empathy && (
          <div className="text-muted-foreground italic">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={emojiList}>
              {aiResponse.empathy}
            </ReactMarkdown>
          </div>
        )}

        {/* Information (primary content) */}
        {aiResponse.information && aiResponse.information.length > 0 && (
          <div className={`markdown-content ${aiResponse.empathy ? 'mt-4' : ''} text-foreground`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={emojiList}>
              {aiResponse.information}
            </ReactMarkdown>
          </div>
        )}

        {/* Disclaimer (footnote style) */}
        {aiResponse.disclaimer && (
          <div className="mt-4 flex items-center gap-2">
            <div className="flex flex-col gap-2 text-xs text-muted-foreground p-2 rounded border-l-2 border-border">
              <strong className="text-foreground/80">Disclaimer</strong>
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={emojiList}>
                {aiResponse.disclaimer}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Follow-up question (inline, subtle) */}
        {aiResponse.followUpQuestion && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="text-muted-foreground">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={emojiList}>
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
