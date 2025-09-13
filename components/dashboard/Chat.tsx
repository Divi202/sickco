/**
 * Chat Component - Handles all chat functionality including messages and input
 * Props: onToggleMobileMenu
 */
'use client';
import { useState, useEffect, useRef } from 'react'; // Import useEffect and useRef
import ChatHeader from './chat/ChatHeader';
import ChatMessages from './chat/ChatMessages';
import ChatInput from './chat/ChatInput';
import axios from 'axios';
import { SickCoAIResponseDTO } from '@/modules/ai/ai.schema';
import { ChatProps, UserMessages } from '../../types/dashboard.types';

const Chat: React.FC<ChatProps> = ({ onToggleMobileMenu, initialMessage }) => {
  const [userMessages, setUserMessages] = useState<UserMessages[]>([]);
  const [sickcoResponses, setSickcoResponses] = useState<SickCoAIResponseDTO[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const [error, setError] = useState<string | null>(null); // New state for errors

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
  }, [userMessages]);

  // Handle sending new message
  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault?.();

    if (!newMessage.trim()) return;

    const userMessageText = newMessage.trim();

    // Generate a temp unique ID for the message
    const userMessageId = crypto.randomUUID();

    // Add user message to chat
    const userMessage: UserMessages = {
      id: userMessageId,
      text: userMessageText,
      timestamp: new Date(),
    };

    setUserMessages((prev) => [...prev, userMessage]);
    setNewMessage(''); // Clear input immediately
    setIsLoading(true);
    setError(null);
    // Call the API to chat with Sickco AI
    try {
      //Using axios
      const response = await axios.post(
        '/api/v1/chat',
        { userMessage: userMessageText },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      const result = response.data;

      setSickcoResponses((prev) => [...prev, result]);

      console.log('AI Response:', result);
      console.log('sicko reposne id', result.id);

      //Updating user message id with the actual id received from db
      userMessage.id = result.id;

      // Add AI response to sickco all the responses
    } catch (err: any) {
      // Extract a useful message from axios error shape if available
      setError(err?.response?.data?.error || 'Failed to get AI response');
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
        userMessages={userMessages}
        aiResponses={sickcoResponses}
        isLoading={isLoading}
        error={error}
        messagesEndRef={messagesEndRef}
      />

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
