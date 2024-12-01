import { Chat } from '@/components/chat';
import { generateUUID } from '@/lib/utils';
import { PunkMessage, PunkContainer, PunkInput } from '@/components/chat/punk-theme';
import { useChat } from 'ai/react';

export default async function Page() {
  const id = generateUUID();

  return (
    <Chat
      key={id}
      id={id}
      initialMessages={[]}
      selectedModelId="gpt-4"
      theme={{
        Container: PunkContainer,
        Message: PunkMessage,
        Input: PunkInput,
      }}
    />
  );
}
