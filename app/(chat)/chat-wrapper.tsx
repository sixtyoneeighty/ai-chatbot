'use client';

import { Chat } from '@/components/chat';

interface ChatWrapperProps {
  id: string;
  selectedModelId: string;
}

export function ChatWrapper({ id, selectedModelId }: ChatWrapperProps) {
  return (
    <Chat
      key={id}
      id={id}
      initialMessages={[]}
      selectedModelId={selectedModelId}
      selectedVisibilityType="private"
      isReadonly={false}
    />
  );
}
