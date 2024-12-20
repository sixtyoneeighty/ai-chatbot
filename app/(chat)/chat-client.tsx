'use client';

import { Chat } from '@/components/chat';

interface ChatClientProps {
  id: string;
  selectedModelId: string;
}

export function ChatClient({ id, selectedModelId }: ChatClientProps) {
  return (
    <div className="flex-1 flex flex-col">
      <Chat
        key={id}
        id={id}
        initialMessages={[]}
        selectedModelId={selectedModelId}
        selectedVisibilityType="private"
        isReadonly={false}
      />
    </div>
  );
}
