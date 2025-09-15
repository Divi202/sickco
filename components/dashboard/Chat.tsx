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
import { ChatProps, UserMessages, ConversationTurn } from '../../types/dashboard.types';

const Chat: React.FC<ChatProps> = ({ onToggleMobileMenu, initialMessage }) => {
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New state for loading

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
  }, [conversation]);

  // Handle clearing chat
  const handleClearChat = () => {
    setConversation([]);
  };

  // Handle sending new message
  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault?.();

    if (!newMessage.trim()) return;

    const userMessageText = newMessage.trim();

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
    setNewMessage(''); // Clear input immediately
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
