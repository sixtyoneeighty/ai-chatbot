'use client';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { modelsList, DEFAULT_MODEL_NAME } from '@/lib/ai/models';
import { auth } from '@/app/(auth)/auth';
import { generateUUID } from '@/lib/utils';
import { Chat } from '@/components/chat';

export default async function ChatPage() {
  const [session, cookieStore] = await Promise.all([
    auth(),
    cookies()
  ]);

  if (!session?.user) {
    redirect('/login');
  }

  const id = generateUUID();
  const modelIdFromCookie = cookieStore.get('model-id')?.value;
  const selectedModelId = modelsList.find(
    (model) => model.id === modelIdFromCookie
  )?.id || DEFAULT_MODEL_NAME;

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
