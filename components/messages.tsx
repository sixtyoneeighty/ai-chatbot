'use client';

import { Message } from 'ai';
import { memo } from 'react';
import equal from 'fast-deep-equal';
import { Vote } from '@/lib/db/schema';
import { PreviewMessage } from './message';
import { Overview } from './overview';

interface MessagesProps {
  chatId: string;
  isLoading: boolean;
  votes: Array<Vote> | undefined;
  messages: Array<Message>;
  setMessages: (
    messages: Message[] | ((messages: Message[]) => Message[]),
  ) => void;
  isReadonly: boolean;
}

function PureMessages({
  chatId,
  isLoading,
  votes,
  messages,
  setMessages,
  isReadonly,
}: MessagesProps) {
  return (
    <div className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4">
      {messages.length === 0 && <Overview />}

      {messages.map((message, index) => (
        <PreviewMessage
          key={message.id}
          chatId={chatId}
          message={message}
          isLoading={isLoading && messages.length - 1 === index}
          vote={
            votes
              ? votes.find((vote) => vote.messageId === message.id)
              : undefined
          }
          setMessages={setMessages}
          isReadonly={isReadonly}
        />
      ))}

      {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
        <div className="flex items-center justify-center p-8 rounded-lg bg-muted">
          <div className="size-4 animate-spin rounded-full border-t-2 border-foreground"></div>
        </div>
      )}
    </div>
  );
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.isLoading !== nextProps.isLoading) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (!equal(prevProps.votes, nextProps.votes)) return false;
  return true;
});
