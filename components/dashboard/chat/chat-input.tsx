'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowUp, LoaderCircle } from 'lucide-react';
import { ChatInputProps } from '@/types/dashboard.types';
import React, { useEffect, useRef } from 'react';

export default function ChatInput({
  newMessage,
  setNewMessage,
  handleSendMessage,
  isLoading,
}: ChatInputProps) {
  const [showEmptyInputWarning, setShowEmptyInputWarning] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const max = 128; // 32 * 4
    const next = Math.min(el.scrollHeight, max);
    el.style.height = next + 'px';
    el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden';
  };

  useEffect(() => {
    resizeTextarea();
  }, [newMessage]);

  const handleSendClick = (e?: React.FormEvent) => {
    if (isLoading) return;
    if (!newMessage.trim()) {
      setShowEmptyInputWarning(true);
      setTimeout(() => {
        setShowEmptyInputWarning(false);
      }, 1000);
      return;
    }
    handleSendMessage(e);
    // Reset textarea size after sending
    const el = textareaRef.current;
    if (el) {
      el.style.height = '44px';
      el.style.overflowY = 'hidden';
    }
  };

  return (
    <div className="relative w-3/4 ">
      <div className="flex items-end gap-2 border rounded-lg bg-muted/20 p-2 pl-3 shadow-sm focus-within:ring-2 focus-within:ring-ring">
        <Textarea
          ref={textareaRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          rows={1}
          placeholder="Ask a follow-up question or describe new symptoms..."
          className={`h-12 max-h-28 w-full resize-none border-0 p-0 leading-6 bg-transparent dark:bg-transparent shadow-none focus-visible:ring-0 focus:ring-0 focus:outline-none ${
            showEmptyInputWarning ? 'ring-2 ring-red-500/70' : ''
          }`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendClick(e);
            }
          }}
        />
        <Button
          onClick={handleSendClick}
          disabled={!newMessage.trim() || isLoading}
          className="rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <LoaderCircle className="h-4 w-4 animate-spin"></LoaderCircle>
          ) : (
            <>
              <ArrowUp className="h-4 w-4" />
              <span className="sr-only">Send Message</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
