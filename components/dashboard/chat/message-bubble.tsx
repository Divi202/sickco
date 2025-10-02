import { ChatMessagesProps } from '@/types/dashboard.types';
import WelcomeMessage from './welcome-message';
import AIResponse from './ai-response';

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
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="animate-pulse mt-4">
              <div className="flex justify-start">
                <div className="flex items-start gap-3 max-w-md">
                  <div className="w-8 h-8 rounded-full bg-foreground/50" />
                  <div className="bg-foreground/50 rounded-xl p-4 space-y-2">
                    <div className="h-4 bg-foreground/70 rounded w-48" />
                    <div className="h-4 bg-foreground/70 rounded w-32" />
                    <div className="h-4 bg-foreground/70 rounded w-24" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Welcome back message */}
      {!isHistoryLoading && conversation.length === 0 && (
        <WelcomeMessage variant={wasCleared ? 'cleared' : 'default'} />
      )}
      <div>
        {/* Conversation turns */}
        {conversation.map((turn) => (
          <div key={turn.id} className={isClearingChat ? 'animate-pulse opacity-50' : ''}>
            {/* User Message */}
            <div className="flex justify-end mb-4">
              {/* Message content*/}
              {turn.userMessage && (
                <div className="max-w-[80%]  rounded-tr-sm rounded-2xl px-4 py-3 text-sm shadow-sm bg-primary text-primary-foreground">
                  <div className="leading-relaxed">{turn.userMessage && turn.userMessage.text}</div>
                </div>
              )}{' '}
              {/* <Avatar className="h-6 w-6 ml-2">
                <AvatarImage src="/diverse-user-avatars.png" alt="You" />
                <AvatarFallback className="text-[10px]">You</AvatarFallback>
              </Avatar> */}
            </div>

            {/* SickCo Message */}
            <div className="flex flex-col justify-start mb-4">
              {/* <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src="/assistant-avatar.png" alt="Sickco AI" />
                <AvatarFallback className="text-[10px]">SC</AvatarFallback>
              </Avatar> */}
              {/* replace with logo in small size */}
              <span className="text-sm mb-2 ml-2">Sickco</span>
              {/* message content*/}
              {turn.aiResponse && (
                <div className="max-w-[80%] bg-card rounded-tl-sm p-5 shadow-sm rounded-2xl px-4 py-3 text-sm  text-foreground">
                  <div className="leading-relaxed">
                    {turn.aiResponse && <AIResponse aiResponse={turn.aiResponse} />}
                  </div>
                </div>
              )}
            </div>

            {/* Typing indicator bubble */}
            {turn.isLoadingAI && (
              <div className="flex justify-start mt-4">
                <div className="flex items-start gap-3 max-w-md">
                  <div className="bg-card/80 backdrop-blur-sm border border-border/30 rounded-xl rounded-tl-sm px-4 py-3 shadow-lg">
                    <div className="flex items-center gap-1">
                      {/* <span className="text-foreground text-sm mr-2">Sickco is typing</span> */}
                      <div className="flex gap-1">
                        <div
                          className="w-1 h-1 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: '0ms' }}
                        />
                        <div
                          className="w-1 h-1 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: '150ms' }}
                        />
                        <div
                          className="w-1 h-1 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: '300ms' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Error */}
            {turn.errorAI && (
              <div className="mt-4 p-4 text-sm mb-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-center">
                {turn.errorAI}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </>
  );
}
