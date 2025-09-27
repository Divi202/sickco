import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time?: string;
};

export default function MessageBubble({ role, content, time }: Message) {
  const isUser = role === 'user';
  return (
    <div className={cn('flex w-full items-end gap-3', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <Avatar className="h-6 w-6">
          <AvatarImage src="/assistant-avatar.png" alt="Sickco AI" />
          <AvatarFallback className="text-[10px]">SC</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted/30 text-foreground',
        )}
      >
        <p className="leading-relaxed">{content}</p>
        {time && (
          <p className={cn('mt-1 text-[10px]', isUser ? 'opacity-85' : 'text-muted-foreground')}>
            {time}
          </p>
        )}
      </div>
      {isUser && (
        <Avatar className="h-6 w-6">
          <AvatarImage src="/diverse-user-avatars.png" alt="You" />
          <AvatarFallback className="text-[10px]">U</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
