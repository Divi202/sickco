// components/dashboard/Chat.tsx
/**
 * Chat Component - Handles all chat functionality including messages and input
 * Props: onToggleMobileMenu
 */
'use client';
import { useState, useEffect, useRef } from 'react';
import ChatHeader from './chat/ChatHeader';
import ChatMessages from './chat/ChatMessages';
import ChatInput from './chat/ChatInput';
import axios from 'axios';
import { ChatProps, UserMessages, ConversationTurn } from '../../types/dashboard.types';
import { SickCoAIResponseDTO } from '@/modules/ai/ai.schema'; // NEW: Import SickCoAIResponseDTO

const Chat: React.FC<ChatProps> = ({ onToggleMobileMenu, initialMessage }) => {
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialMessageSentRef = useRef(false); // NEW: To prevent sending initial message multiple times

  // Effect to scroll to the bottom of the chat whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [conversation]);

  // NEW: Effect to load chat history when the component mounts
  useEffect(() => {
    const loadChatHistory = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/v1/chat/history');
        const historyData = response.data;

        // Map fetched history to ConversationTurn format
        const formattedHistory: ConversationTurn[] = historyData.map((entry: any) => ({
          id: entry.id,
          userMessage: {
            id: entry.id,
            text: entry.user_message,
            timestamp: new Date(entry.created_at),
          },
          aiResponse: entry.ai_response ? (entry.ai_response as SickCoAIResponseDTO) : undefined,
          isLoadingAI: false,
          errorAI: undefined,
        }));
        setConversation(formattedHistory);
      } catch (error) {
        console.error('Failed to load chat history:', error);
        // Optionally, display an error message to the user
      } finally {
        setIsLoading(false);
      }
    };

    loadChatHistory();
  }, []); // Run only once on mount

  // NEW: Effect to handle initial message after history is loaded and not yet sent
  useEffect(() => {
    // Only process initialMessage if it exists, hasn't been sent yet,
    // and we are not currently loading (which includes initial history load)
    if (initialMessage && !initialMessageSentRef.current && !isLoading) {
      // Check if conversation is loaded (even if empty)
      // This ensures initialMessage is processed after history is fetched
      if (conversation.length >= 0) {
        initialMessageSentRef.current = true; // Mark as sent
        // Directly call handleSendMessage with the initial message
        // This avoids issues with state updates not being immediate
        handleSendMessage(undefined, initialMessage);
      }
    }
  }, [initialMessage, isLoading, conversation.length]); // Depend on initialMessage, isLoading, and conversation length

  // Handle clearing chat
  const handleClearChat = async () => {
    // MODIFIED: Made async
    try {
      await axios.post('/api/v1/chat/clear'); // NEW: Call API to soft delete chats
      setConversation([]); // Clear local state only after successful API call
    } catch (error) {
      console.error('Failed to clear chat history:', error);
      // Optionally, display an error message to the user
    }
  };

  // Handle sending new message
  const handleSendMessage = async (e?: React.FormEvent, messageToSend?: string) => {
    // MODIFIED: Added messageToSend parameter
    e?.preventDefault?.();

    const userMessageText = messageToSend || newMessage.trim(); // Use messageToSend if provided, otherwise use newMessage

    if (!userMessageText) return; // Check if message is empty

    // Generate a temp unique ID for the message
    const tempId = crypto.randomUUID();

    // Add user message to chat
    const userMessage: UserMessages = {
      id: tempId,
      text: userMessageText,
      timestamp: new Date(),
    };

    // Create conversation turn with loading state
    const newTurn: ConversationTurn = {
      id: tempId,
      userMessage,
      isLoadingAI: true,
    };

    setConversation((prev) => [...prev, newTurn]);
    if (!messageToSend) {
      // Only clear input if it's not an initial message being sent
      setNewMessage('');
    }
    setIsLoading(true);

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

      console.log('AI Response:', result);
      console.log('sicko reposne id', result.id);

      // Update the conversation turn with AI response and actual ID
      setConversation((prev) =>
        prev.map((turn) =>
          turn.id === tempId
            ? {
                ...turn,
                id: result.id,
                userMessage: { ...turn.userMessage, id: result.id },
                aiResponse: result,
                isLoadingAI: false,
              }
            : turn,
        ),
      );
    } catch (err: any) {
      // Extract a useful message from axios error shape if available
      const errorMessage = err?.response?.data?.error || 'Failed to get AI response';

      // Update the conversation turn with error
      setConversation((prev) =>
        prev.map((turn) =>
          turn.id === tempId
            ? {
                ...turn,
                isLoadingAI: false,
                errorAI: errorMessage,
              }
            : turn,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Chat Header  - Handles the chat header and mobile menu button*/}
      <ChatHeader onToggleMobileMenu={onToggleMobileMenu} onClearChat={handleClearChat} />

      {/* Chat Messages- Displays the list of messages, loading state, and error state.*/}
      <ChatMessages conversation={conversation} messagesEndRef={messagesEndRef} />

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
