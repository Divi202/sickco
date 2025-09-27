'use client';

import { useMemo, useState } from 'react';
import MessageBubble, { type Message } from '@/components/dashboard/chatv2/message-bubble';
import ChatInput from './chat-input';

export default function ChatWindow() {
  const initial: Message[] = useMemo(
    () => [
      {
        id: 'm1',
        role: 'user',
        content: 'Hello',
        time: '02:27 PM',
      },
      {
        id: 'm2',
        role: 'assistant',
        content:
          "Thank you for sharing your symptoms. I'm analyzing your condition to create a personalized recovery plan.",
        time: '02:28 PM',
      },
    ],
    [],
  );
  const [messages, setMessages] = useState<Message[]>(initial);

  function send(text: string) {
    const now = new Date();
    const t = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [
      ...prev,
      { id: `u-${prev.length}`, role: 'user', content: text, time: t },
      {
        id: `a-${prev.length}`,
        role: 'assistant',
        content: 'Thanks! I’ll process that and suggest next steps.',
        time: t,
      },
    ]);
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="px-4 py-4 border-b border-border">
        <h1 className="text-xl font-semibold">Sickco AI</h1>
        <p className="text-sm text-muted-foreground">Your personal health companion</p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-6">
        {messages.map((m) => (
          <MessageBubble key={m.id} {...m} />
        ))}
      </div>

      <div className="sticky bottom-0 flex justify-center bg-background px-4 py-4">
        <ChatInput onSend={send} />
      </div>
    </div>
  );
}
