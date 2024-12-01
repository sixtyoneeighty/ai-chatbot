'use server';

import { cookies } from 'next/headers';
import { openai } from '@/lib/ai';

export async function saveModelId(model: string) {
  const cookieStore = await cookies();
  cookieStore.set('model-id', model);
}

export async function generateTitleFromUserMessage({
  message,
}: {
  message: { content: string; role: string };
}) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gemini-1.5-pro',
      messages: [
        {
          role: 'system',
          content: `
          - you will generate a short title based on the first message a user begins a conversation with
          - ensure it is not more than 80 characters long
          - the title should be a summary of the user's message
          - do not use quotes or colons`
        },
        {
          role: 'user',
          content: message.content
        }
      ],
      temperature: 0.7,
      max_tokens: 60,
    });

    return response.choices[0]?.message?.content || 'New Chat';
  } catch (error) {
    console.error('Error generating title:', error);
    return 'New Chat';
  }
}
