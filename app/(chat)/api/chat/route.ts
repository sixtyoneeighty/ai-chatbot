import { Message, convertToCoreMessages, streamText } from 'ai';
import { Tavily } from '@tavily/core';
import { auth } from '@/app/(auth)/auth';
import { model } from '@/lib/ai/models';
import { systemPrompt } from '@/lib/ai/prompts';
import { generateUUID } from '@/lib/utils';
import { saveChat, saveMessages, getChatById, deleteChatById } from '@/lib/db/queries';
import { generateTitleFromUserMessage } from '../../actions';

const tavily = new Tavily({ apiKey: process.env.TAVILY_API_KEY || '' });

export const maxDuration = 60;

export async function POST(request: Request) {
  const { id, messages }: { 
    id: string; 
    messages: Array<Message>;
  } = await request.json();

  const session = await auth();

  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const coreMessages = convertToCoreMessages(messages);
  const latestMessage = coreMessages[coreMessages.length - 1];

  if (!latestMessage) {
    return new Response('No message found', { status: 400 });
  }

  const chat = await getChatById({ id });

  if (!chat) {
    const title = await generateTitleFromUserMessage({ message: latestMessage });
    await saveChat({ id, userId: session.user.id, title });
  }

  const messageId = generateUUID();
  await saveMessages({
    messages: [
      { ...latestMessage, id: messageId, createdAt: new Date(), chatId: id },
    ],
  });

  // Search for relevant information using Tavily if needed
  let additionalContext = "";
  if (needsMusicContext(latestMessage.content)) {
    try {
      const searchResponse = await tavily.search({ 
        query: latestMessage.content + " punk rock music",
        searchDepth: "advanced",
        include_answer: true,
        include_domains: [
          "punknews.org",
          "nofx.org",
          "fatwreck.com",
          "epitaph.com",
          "altpress.com",
          "brooklynvegan.com",
          "pitchfork.com"
        ]
      });
      additionalContext = searchResponse.results
        .slice(0, 3)
        .map(r => r.content)
        .join('\n\n');
    } catch (error) {
      console.error('Tavily search failed:', error);
    }
  }

  const result = await streamText({
    model,
    messages: coreMessages,
    system: additionalContext 
      ? `${systemPrompt}\n\nRecent information from reliable sources:\n${additionalContext}`
      : systemPrompt,
  });

  return result.toDataStreamResponse({});
}

function needsMusicContext(message: string): boolean {
  const musicTriggers = [
    'what is',
    'who is',
    'when did',
    'where is',
    'why does',
    'how does',
    'latest',
    'news about',
    'current',
    'recent',
    'tour',
    'album',
    'release',
    'band',
    'song',
    'concert',
    'show',
    'venue',
    'label',
    'record',
    'punk',
    'fat wreck',
    'epitaph'
  ];
  return musicTriggers.some(trigger => 
    message.toLowerCase().includes(trigger)
  );
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Missing chat ID', { status: 400 });
  }

  const session = await auth();

  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  await deleteChatById({ id });
  return new Response('OK');
}
