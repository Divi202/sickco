'use client';

import type React from 'react';
import { LoaderCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ClearChatBtnProps = {
  onClearChat: () => void;
  isLoading: boolean;
};

export default function ClearChatBtn({ onClearChat, isLoading }: ClearChatBtnProps) {
  // console.log('isLoading status:', isLoading);
  return (
    <Button
      onClick={onClearChat}
      title="Clear chat history"
      aria-label="Clear chat history"
      disabled={isLoading}
      className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 border border-border rounded-md text-foreground/80 hover:text-foreground transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <LoaderCircle className="h-4 w-4"></LoaderCircle>
      ) : (
        <>
          <Trash2 className="w-4 h-4" aria-hidden="true" />
          <span className="hidden sm:inline">Clear Chats</span>
        </>
      )}
    </Button>
  );
}
