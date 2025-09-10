import { SickCoAIResponseDTO } from '@/modules/ai/ai.schema';
import { RefObject } from 'react';

//Chat component types
export interface ChatProps {
  onToggleMobileMenu: () => void;
  initialMessage?: string; // Add initialMessage prop
}

export interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: Date;
}

// ChatHeader component types
export interface ChatHeaderProps {
  onToggleMobileMenu: () => void;
}

// ChatHeader component types
export interface ChatInputProps {
  newMessage: string;
  setNewMessage: (msg: string) => void;
  handleSendMessage: (e?: React.FormEvent) => void;
  isLoading: boolean;
}

// ChatMessages component types
export interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  messagesEndRef: RefObject<HTMLDivElement | null>; // <-- Allow null here
  aiResponse: SickCoAIResponseDTO | null;
}

// AIResponse component types
export interface AIResponseProps {
  aiResponse: SickCoAIResponseDTO;
}
