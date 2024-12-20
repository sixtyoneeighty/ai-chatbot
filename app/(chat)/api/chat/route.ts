import { Message, convertToCoreMessages, streamText } from 'ai';
import { tavily } from '@tavily/core';
import { auth } from '@/app/(auth)/auth';
import { models, DEFAULT_MODEL_NAME } from '@/lib/ai/models';
import { deleteChatById } from '@/lib/db/queries';

// Initialize Tavily
const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY || '' });

const SYSTEM_PROMPT = `You are a friendly and knowledgeable AI assistant with expertise in punk rock music. 
Your responses should be informative, engaging, and reflect the spirit of punk rock culture. 
When discussing music, bands, or events, try to provide relevant historical context and interesting facts.
Feel free to express enthusiasm and personality in your responses while maintaining accuracy and helpfulness.`;

export async function POST(req: Request) {
  const { messages, id } = await req.json();
  const session = await auth();

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const coreMessages = convertToCoreMessages(messages);
  const lastMessage = coreMessages[coreMessages.length - 1];
  const lastMessageContent = typeof lastMessage.content === 'string' 
    ? lastMessage.content 
    : Array.isArray(lastMessage.content) 
      ? lastMessage.content.map(part => typeof part === 'string' ? part : '').join(' ')
      : '';

  try {
    // Perform searches
    const [domainResults, openResults] = await Promise.all([
      tavilyClient.search(lastMessageContent, {
        searchDepth: 'advanced',
        includeDomains: [
          'punknews.org',
          'punktastic.com',
          'kerrang.com',
          'altpress.com',
          'brooklynvegan.com'
        ]
      }),
      tavilyClient.search(lastMessageContent, {
        searchDepth: 'advanced'
      })
    ]);

    // Combine and deduplicate results
    const seenUrls = new Set();
    const allResults = [...domainResults.results, ...openResults.results]
      .filter(result => {
        if (seenUrls.has(result.url)) return false;
        seenUrls.add(result.url);
        return true;
      })
      .slice(0, 4);

    // Create search context
    const searchContext = allResults
      .map(result => `${result.title}: ${result.content}`)
      .join('\n\n');

    // Create messages array with proper typing
    const messagesForModel = [
      { role: 'system' as const, content: `${SYSTEM_PROMPT}\n\nRecent information:\n${searchContext}` },
      ...coreMessages
    ];

    const result = await streamText({
      model: models[DEFAULT_MODEL_NAME],
      messages: messagesForModel,
      onFinish: async (completion) => {
        // Optional: Handle any post-completion tasks here
        console.log('Chat completion finished');
      },
    });

    return result.toDataStreamResponse({});
  } catch (error) {
    console.error('Error generating response:', error);
    return new Response('Error generating response', { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const session = await auth();

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  if (!id) {
    return new Response('Missing chat ID', { status: 400 });
  }

  try {
    await deleteChatById({ id });
    return new Response('OK');
  } catch (error) {
    console.error('Error deleting chat:', error);
    return new Response('Error deleting chat', { status: 500 });
  }
}
