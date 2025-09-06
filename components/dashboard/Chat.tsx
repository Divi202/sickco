/**
 * Chat Component - Handles all chat functionality including messages and input
 * Props: onToggleMobileMenu
 */
'use client';
import { useState, useEffect, useRef } from 'react'; // Import useEffect and useRef
import ChatHeader from './chat/ChatHeader';
import ChatMessages from './chat/ChatMessages';
import AIResponse from './chat/AIResponse';
import ChatInput from './chat/ChatInput';
import axios from 'axios';
import { SickCoAIResponseDTO } from '@/modules/ai/ai.schema';

interface ChatProps {
  onToggleMobileMenu: () => void;
  initialMessage?: string; // Add initialMessage prop
}

const Chat: React.FC<ChatProps> = ({ onToggleMobileMenu, initialMessage }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey there! I'm Sicko, your AI assistant. How can I help you today?",
      sender: 'sicko',
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const [error, setError] = useState<string | null>(null); // New state for errors
  const [aiResponse, setAiResponse] = useState<SickCoAIResponseDTO | null>(null); // New state for AI response

  const messagesEndRef = useRef<HTMLDivElement>(null); // Create a ref for the messages container

  // Effect to pre-fill message if initialMessage is provided
  useEffect(() => {
    if (initialMessage) {
      setNewMessage(initialMessage);
    }
  }, [initialMessage]);

  // Effect to scroll to the bottom of the chat whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle sending new message
  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault?.();

    if (!newMessage.trim()) return;

    const userMessageText = newMessage.trim();

    // Add user message to chat
    const userMessage = {
      id: messages.length + 1,
      text: userMessageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage(''); // Clear input immediately
    setIsLoading(true);
    setError(null);
    setAiResponse(null); // Clear previous AI response

    // Call the API to chat with Sickco AI
    try {
      //Using axios
      const response = await axios.post(
        '/api/v1/chat',
        { message: userMessageText },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      const result = response.data;

      setAiResponse(result);

      console.log('AI Response:', result.information);
      // Add AI response to chat messages
      // Note: The ID calculation here might be slightly off if messages state updates
      // are not immediate. For a robust solution, consider using a unique ID generator.
      const sickCoResponse = {
        id: messages.length + 2,
        text: `Here's the analysis for "${userMessageText}":\n\n${result.information}`,
        // text: aiResponse,
        sender: 'sicko',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, sickCoResponse]);
    } catch (err: any) {
      // Extract a useful message from axios error shape if available
      const apiMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        (typeof err?.response?.data === 'string' ? err.response.data : undefined) ||
        err?.message ||
        'An unexpected error occurred.';

      setError(apiMessage);
      // Add an error message to the chat if the API call fails
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: `Error: ${apiMessage}`,
          sender: 'sicko',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Chat Header  - Handles the chat header and mobile menu button*/}
      <ChatHeader onToggleMobileMenu={onToggleMobileMenu} />

      {/* Chat Messages- Displays the list of messages, loading state, and error state.*/}
      <ChatMessages
        messages={messages}
        isLoading={isLoading}
        error={error}
        messagesEndRef={messagesEndRef}
      />

      {/* AIResponse - Displays the AI analysis and recommendations. */}
      {aiResponse && <AIResponse aiResponse={aiResponse} />}

      {/* Chat Input - Handles the message input and send button.*/}
      <ChatInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};
export default Chat;
