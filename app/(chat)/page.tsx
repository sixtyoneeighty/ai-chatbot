import { generateUUID } from '@/lib/utils';
import { PunkChat } from '@/components/chat/punk-chat';

export default async function Page() {
  const id = generateUUID();

  return (
    <PunkChat
      key={id}
      id={id}
      initialMessages={[]}
      selectedModelId="gemini-1.5-pro"
    />
  );
}
