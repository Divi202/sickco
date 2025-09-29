import { ChatHeaderProps } from '@/types/dashboard.types';
import ClearChatBtn from '@/components/dashboard/chat/ClearChatBtn';

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClearChat }) => (
  <div className="px-4 py-4 border-b border-border">
    <h1 className="text-xl font-semibold">Sickco AI</h1>
    <p className="text-sm text-muted-foreground">Your personal health companion</p>
    {/* Clear Chat Button  - wip for now used old one*/}
    {/* <ClearChatBtn onClearChat={onClearChat} /> */}
  </div>
);

export default ChatHeader;
