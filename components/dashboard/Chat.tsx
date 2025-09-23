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
import { motion } from 'framer-motion';

const Chat: React.FC<ChatProps> = ({ onToggleMobileMenu, initialMessage }) => {
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  const [isClearingChat, setIsClearingChat] = useState(false);
  const [emptyDueToClear, setEmptyDueToClear] = useState(false); // NEW

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Effect to scroll to the bottom of the chat whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [conversation]);

  // Effect to load chat history when the component mounts
  useEffect(() => {
    const loadChatHistory = async () => {
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
        // If history has messages, ensure cleared flag is off
     setEmptyDueToClear(formattedHistory.length === 0 ? emptyDueToClear : false);
        // Handle initial message from homepage navigation
        const initialMessageConsumed = sessionStorage.getItem('initialMessageConsumed');
        if (initialMessage && !initialMessageConsumed) {
          // Pre-fill the input with the initial message for user to edit/send
          setNewMessage(initialMessage);
          // Mark as consumed so it doesn't reappear on refresh
          sessionStorage.setItem('initialMessageConsumed', 'true');
        } else {
          // Ensure input is empty if no initial message or already consumed
          setNewMessage('');
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
        // Optionally, display an error message to the user
      } finally {
        setIsHistoryLoading(false);
      }
    };

    loadChatHistory();
  }, []); // Run only once on mount

  // Handle clearing chat
  const handleClearChat = async () => {
    // MODIFIED: Made async
    try {
      // Start clearing animation
      setIsClearingChat(true);

      // Wait for animation to complete before clearing
      setTimeout(async () => {
        await axios.post('/api/v1/chat/clear');
        setConversation([]); // Clear local state only after successful API call
        // Remove the consumed flag so new initial messages can be processed
        sessionStorage.removeItem('initialMessageConsumed');
        setIsClearingChat(false);
   // Show cleared empty-state
   setEmptyDueToClear(true);
        // Show confirmation message
        setShowClearConfirmation(true);
        setTimeout(() => {
          setShowClearConfirmation(false);
        }, 3000);
      }, 500); // Wait for fade out animation
    } catch (error) {
      console.error('Failed to clear chat history:', error);
      setIsClearingChat(false);
      // Optionally, display an error message to the user
    }
  };

  // Handle sending new message
  const handleSendMessage = async (e?: React.FormEvent, messageToSend?: string) => {
    // MODIFIED: Added messageToSend parameter
    e?.preventDefault?.();

    const userMessageText = messageToSend || newMessage.trim();

    if (!userMessageText) return;

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
      setNewMessage(''); // Always clear the input after sending
    }
    setEmptyDueToClear(false); // user starts a new conversation
    setIsLoading(true);

    // Call the API to chat with Sickco AI
    try {
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
      {/* Chat Header - Handles the chat header and mobile menu button*/}
      <ChatHeader onToggleMobileMenu={onToggleMobileMenu} onClearChat={handleClearChat} />

      {/* Chat Messages - Displays the list of messages, loading state, and error state.*/}
      {/* Chat Cleared Confirmation */}
      {showClearConfirmation && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mx-4 md:mx-6 mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-center text-sm font-medium"
        >
          ✅ Chat history cleared successfully!
        </motion.div>
      )}

<ChatMessages
        conversation={conversation}
        messagesEndRef={messagesEndRef}
        isHistoryLoading={isHistoryLoading}
        isClearingChat={isClearingChat}
        wasCleared={emptyDueToClear}
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
