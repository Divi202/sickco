import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ChatMessagesProps } from '@/types/dashboard.types';
import WelcomeMessage from '../chat/WelcomeMessage';
import AIResponse from '../chat/AIResponse';

export default function MessageBubble({
  conversation,
  messagesEndRef,
  isHistoryLoading,
  isClearingChat,
  wasCleared,
}: ChatMessagesProps) {
  return (
    <>
      {/* Show skeleton loader while loading history-WIP*/}
      {isHistoryLoading && conversation.length === 0 && (
        <div>
          {/* Skeleton message bubbles */}
          {[1, 2, 3].map((index) => (
            <div key={index} className="animate-pulse mt-4">
              <div className="flex justify-start">
                <div className="flex items-start gap-3 max-w-md">
                  <div className="w-8 h-8 rounded-full bg-slate-600/50" />
                  <div className="bg-slate-700/50 rounded-xl p-4 space-y-2">
                    <div className="h-4 bg-slate-600/50 rounded w-48" />
                    <div className="h-4 bg-slate-600/50 rounded w-32" />
                    <div className="h-4 bg-slate-600/50 rounded w-24" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Welcome back message - WIP */}
      {!isHistoryLoading && conversation.length === 0 && (
        <WelcomeMessage variant={wasCleared ? 'cleared' : 'default'} />
      )}
      <div
        ref={messagesEndRef} // Attach the ref here
      >
        {/* Conversation turns */}
        {conversation.map((turn) => (
          <div key={turn.id} className={isClearingChat ? 'animate-pulse opacity-50' : ''}>
            {/* User Message */}
            <div className="flex justify-end">
              {/* Message content*/}
              {turn.userMessage && (
                <div className="max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm bg-primary text-primary-foreground">
                  <div className="leading-relaxed">{turn.userMessage && turn.userMessage.text}</div>
                </div>
              )}{' '}
              <Avatar className="h-6 w-6">
                <AvatarImage src="/diverse-user-avatars.png" alt="You" />
                <AvatarFallback className="text-[10px]">You</AvatarFallback>
              </Avatar>
            </div>

            {/* AI Response or Loading/Error State - WIP*/}
            {/* Typing indicator bubble  - WIP*/}

            {/* SickCo Message  */}
            <div className="flex justify-start">
              <Avatar className="h-6 w-6">
                <AvatarImage src="/assistant-avatar.png" alt="Sickco AI" />
                <AvatarFallback className="text-[10px]">SC</AvatarFallback>
              </Avatar>
              {/* // message content*/}
              {turn.aiResponse && (
                <div className="max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm  bg-muted/30 text-foreground">
                  <div className="leading-relaxed">
                    {' '}
                    {turn.aiResponse && <AIResponse aiResponse={turn.aiResponse} />}{' '}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
