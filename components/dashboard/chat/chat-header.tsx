import { ChatHeaderProps } from '@/types/dashboard.types';
import ClearChatBtn from '@/components/dashboard/chat/clear-chat-btn';

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClearChat, isLoading }) => (
  <div className="flex justify-between items-center px-4 py-2 border-b border-border">
    {/* Clear Chat Button  - wip for now used old one*/}

    <div className="flex flex-col ">
      <h1 className="text-lg font-semibold">Sickco AI</h1>
      <p className="text-xs text-muted-foreground">Your personal sickness companion</p>
    </div>
    {/* Clear chat button  */}
    <ClearChatBtn onClearChat={onClearChat} isLoading={isLoading} />
  </div>
);

export default ChatHeader;
