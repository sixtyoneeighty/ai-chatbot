'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { modelsList, DEFAULT_MODEL_NAME } from '@/lib/ai/models';
import { auth } from '@/app/(auth)/auth';
import { generateUUID } from '@/lib/utils';
import { ChatWrapper } from './chat-wrapper';

export default async function ChatPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const id = generateUUID();

  // Get model from cookie or use default
  const modelIdFromCookie = cookies().has('model-id') 
    ? cookies().get('model-id')?.value 
    : null;
    
  const selectedModelId = modelsList.find(
    (model) => model.id === modelIdFromCookie
  )?.id || DEFAULT_MODEL_NAME;

  return (
    <ChatWrapper
      id={id}
      selectedModelId={selectedModelId}
    />
  );
}
