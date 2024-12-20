'use client';

import type { Message } from 'ai';
import { useChat } from 'ai/react';
import { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';

import { ChatHeader } from '@/components/chat-header';
import type { Vote } from '@/lib/db/schema';
import { fetcher } from '@/lib/utils';
import { Messages } from './messages';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { SendIcon } from './icons';
import { VisibilityType } from './visibility-selector';

export function Chat({
  id,
  initialMessages,
  selectedModelId,
  selectedVisibilityType,
  isReadonly,
}: {
  id: string;
  initialMessages: Array<Message>;
  selectedModelId: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}) {
  const { mutate } = useSWRConfig();

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    isLoading,
  } = useChat({
    id,
    body: { id, modelId: selectedModelId },
    initialMessages,
    onFinish: () => {
      mutate('/api/history');
    },
  });

  const { data: votes } = useSWR<Array<Vote>>(
    `/api/vote?chatId=${id}`,
    fetcher,
  );

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <ChatHeader
        chatId={id}
        selectedModelId={selectedModelId}
        selectedVisibilityType={selectedVisibilityType}
        isReadonly={isReadonly}
      />

      <Messages
        chatId={id}
        isLoading={isLoading}
        votes={votes}
        messages={messages}
        setMessages={setMessages}
        isReadonly={isReadonly}
      />

      {!isReadonly && (
        <form onSubmit={handleSubmit} className="flex mx-auto px-4 pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
          <Input
            placeholder="Ask about punk rock..."
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            <SendIcon className="h-4 w-4" />
          </Button>
        </form>
      )}
    </div>
  );
}
