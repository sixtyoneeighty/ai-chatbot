'use client';

import { Message } from 'ai';
import { BotIcon, UserIcon } from './icons';
import { cn } from '@/lib/utils';
import { Markdown } from './markdown';
import { Vote } from '@/lib/db/schema';
import { MessageActions } from './message-actions';

export function PreviewMessage({
  chatId,
  message,
  isLoading,
  vote,
  setMessages,
  isReadonly,
}: {
  chatId: string;
  message: Message;
  isLoading: boolean;
  vote: Vote | undefined;
  setMessages: (messages: Message[] | ((messages: Message[]) => Message[])) => void;
  isReadonly: boolean;
}) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('group relative flex items-start md:px-4')}>
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow',
          isUser ? 'bg-background' : 'bg-primary text-primary-foreground'
        )}
      >
        {isUser ? <UserIcon /> : <BotIcon />}
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        {message.content && (
          <div className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0">
            <Markdown content={message.content} />
          </div>
        )}
        {!isLoading && !isReadonly && (
          <MessageActions
            chatId={chatId}
            message={message}
            vote={vote}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}