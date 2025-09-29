import { SickCoAIResponseDTO } from '@/modules/ai/ai.schema';
import { RefObject } from 'react';

// Conversation Turn - represents a complete exchange between user and AI
export interface ConversationTurn {
  id: string; // Chat entry ID from database
  userMessage: UserMessages;
  aiResponse?: SickCoAIResponseDTO;
  isLoadingAI?: boolean;
  errorAI?: string;
}

//Chat component types
export interface ChatProps {
  // onToggleMobileMenu: () => void;
  initialMessage?: string; // Add initialMessage prop
}

export interface UserMessages {
  id: string;
  text: string;
  timestamp: Date;
}

// ChatHeader component types
export interface ChatHeaderProps {
  // onToggleMobileMenu: () => void;
  onClearChat: () => void;
}

// ChatInput component types
export interface ChatInputProps {
  newMessage: string;
  setNewMessage: (msg: string) => void;
  handleSendMessage: (e?: React.FormEvent) => void;
  isLoading: boolean;
}

// ChatMessages component types
export interface ChatMessagesProps {
  conversation: ConversationTurn[];
  messagesEndRef: RefObject<HTMLDivElement | null>;
  isHistoryLoading: boolean;
  isClearingChat: boolean;
  wasCleared?: boolean; // optional to avoid breaking usage
}

// AIResponse component types
export interface AIResponseProps {
  aiResponse: SickCoAIResponseDTO;
}

// ClearChatBtn component types
export interface ClearChatBtnProps {
  onClearChat: () => void;
}
