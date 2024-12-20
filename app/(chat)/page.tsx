import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { Chat } from '@/components/chat';
import { modelsList, DEFAULT_MODEL_NAME } from '@/lib/ai/models';
import { auth } from '@/app/(auth)/auth';
import { generateUUID } from '@/lib/utils';

export default async function ChatPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in');
  }

  const id = generateUUID();

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get('model-id')?.value;
  const selectedModelId =
    modelsList.find((model) => model.id === modelIdFromCookie)?.id ||
    DEFAULT_MODEL_NAME;

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
