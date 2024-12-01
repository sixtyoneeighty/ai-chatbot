'use client';

import type { Message } from 'ai';
import { useChat } from 'ai/react';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { useWindowSize } from 'usehooks-ts';

import { ChatHeader } from '@/components/chat-header';
import { PreviewMessage, ThinkingMessage } from '@/components/message';
import { useScrollToBottom } from '@/components/use-scroll-to-bottom';
import type { Vote } from '@/lib/db/schema';
import { fetcher } from '@/lib/utils';

import { Block, type UIBlock } from '../block';
import { BlockStreamHandler } from '../block-stream-handler';
import { MultimodalInput } from '../multimodal-input';
import { Overview } from '../overview';
import { PunkContainer, PunkMessage, PunkInput } from './punk-theme';

export function PunkChat({
  id,
  initialMessages,
  selectedModelId,
}: {
  id: string;
  initialMessages: Array<Message>;
  selectedModelId: string;
}) {
  const { mutate } = useSWRConfig();
  const { height } = useWindowSize();
  const { data: votes } = useSWR<Array<Vote>>(`/api/votes/${id}`, fetcher);
  const [block, setBlock] = useState<UIBlock>({ type: 'none' });
  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const scrollToBottom = useScrollToBottom();

  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      id,
      body: {
        id,
        selectedModelId,
      },
      initialMessages,
      onFinish: () => {
        setBlock({ type: 'none' });
        mutate(`/api/chats/${id}`);
        mutate(`/api/votes/${id}`);
      },
    });

  return (
    <PunkContainer>
      <div className="pb-[200px] pt-4 md:pt-10">
        {messages.length ? (
          <>
            <ChatHeader />
            {messages.map((message, i) => (
              <PreviewMessage
                key={message.id}
                chatId={id}
                message={message}
                block={block}
                setBlock={setBlock}
                vote={votes?.find((vote) => vote.messageId === message.id)}
                isLoading={i === messages.length - 1 && isLoading}
              />
            ))}
          </>
        ) : (
          <Overview />
        )}
        <AnimatePresence>
          {isLoading && !messages.length && <ThinkingMessage />}
        </AnimatePresence>
        <BlockStreamHandler block={block} setBlock={setBlock} />
      </div>
      <MultimodalInput
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        attachments={attachments}
        setAttachments={setAttachments}
        InputComponent={PunkInput}
      />
    </PunkContainer>
  );
}
