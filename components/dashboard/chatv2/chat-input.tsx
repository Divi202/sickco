'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

export default function ChatInput({ onSend }: { onSend: (text: string) => void }) {
  const [value, setValue] = useState('');

  function handleSend() {
    const text = value.trim();
    if (!text) return;
    onSend(text);
    setValue('');
  }

  return (
    <div className="relative w-3/4 ">
      <div className="flex items-center gap-2 border rounded-lg bg-muted/20 p-2 pl-3 shadow-sm">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={1}
          placeholder="Ask a follow-up question or describe new symptoms..."
          className="h-12 max-h-28 w-full resize-none border-0  p-0 leading-6 focus-visible:ring-0"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button onClick={handleSend} className="rounded-lg" aria-label="Send message">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
