'use client';

import { useState, useEffect, useRef } from 'react';
import MessageBubble from '@/components/dashboard/chat/message-bubble';
import ChatInput from './chat-input';
import axios from 'axios';
import { ChatProps, UserMessages, ConversationTurn } from '@/types/dashboard.types';
import { SickCoAIResponseDTO } from '@/modules/ai/ai.schema'; // NEW: Import SickCoAIResponseDTO
import ChatHeader from './chat-header';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { CircleCheck } from 'lucide-react';

const ChatWindow: React.FC<ChatProps> = ({ initialMessage }) => {
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  const [isClearingChat, setIsClearingChat] = useState(false);
  const [emptyDueToClear, setEmptyDueToClear] = useState(false); // NEW

  const messagesEndRef = useRef<HTMLDivElement>(null);
  // console.log('chat window: message received from the homepage', initialMessage);
  // Effect to scroll to the bottom of the chat whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
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

        //Handle message received form the homepage
        if (initialMessage?.trim()) {
          setNewMessage(initialMessage);
          // Optionally track the last message if you still want to avoid duplicates across refreshes:
          sessionStorage.setItem('lastInitialMessage', initialMessage);
        } else {
          // Only clear if there isn't a new initial message or user refreseh the page
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
  }, [initialMessage]); // Run only once on mount

  // Handle clearing chat
  const handleClearChat = async () => {
    // MODIFIED: Made async
    try {
      // Start clearing animation
      setIsClearingChat(true);

      // Wait for animation to complete before clearing
      setTimeout(async () => {
        try {
          await axios.post('/api/v1/chat/clear');
          setConversation([]); // Clear local state only after successful API call

          setIsClearingChat(false);
          // Show cleared empty-state
          setEmptyDueToClear(true);
          // Show confirmation message
          setShowClearConfirmation(true);
          setTimeout(() => {
            setShowClearConfirmation(false);
          }, 3000);
        } catch (error) {
          console.error('Failed to clear chat history:', error);
          setIsClearingChat(false);
          // Optionally, display an error message to the user
        } finally {
          setIsLoading(false); // Move this inside the setTimeout callback
        }
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

      // console.log('AI Response:', result);
      // console.log('sicko reposne id', result.id);

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
    <div className="flex h-screen flex-col">
      {/*  Chat Header - Handles the chat header and mobile menu button */}
      <ChatHeader onClearChat={handleClearChat} isLoading={isClearingChat} />

      {/* Chat Cleared Confirmation - WIP */}
      {showClearConfirmation && (
        <Alert variant="default">
          <CircleCheck></CircleCheck>
          <AlertTitle>Chat history cleared successfully!</AlertTitle>
        </Alert>
      )}

      {/* Chat Messages - Displays the list of messages, loading state, and error state.*/}
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-6">
        <MessageBubble
          conversation={conversation}
          messagesEndRef={messagesEndRef}
          isHistoryLoading={isHistoryLoading}
          isClearingChat={isClearingChat}
          wasCleared={emptyDueToClear}
        />
      </div>

      {/* Chat Input - Handles the message input and send button.*/}
      <div className="sticky bottom-0 flex justify-center bg-background px-4 py-4">
        <ChatInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ChatWindow;
