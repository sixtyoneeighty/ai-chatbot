import { Message, convertToCoreMessages, streamText } from 'ai';
import { tavily } from '@tavily/core';
import { auth } from '@/app/(auth)/auth';
import { models, DEFAULT_MODEL_NAME } from '@/lib/ai/models';

// Initialize Tavily
const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY || '' });

export const maxDuration = 60;

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

  // Perform a domain-specific search focused on punk rock
  const domainResults = await tavilyClient.search(lastMessageContent, {
    searchDepth: 'advanced',
    includeDomains: [
      'punknews.org',
      'punktastic.com',
      'kerrang.com',
      'altpress.com',
      'brooklynvegan.com',
      'thepunksite.com',
      'dyingscene.com',
      'propertyofzack.com',
      'absolutepunk.net',
      'punxinsolidarity.com'
    ]
  });

  // Perform an open search for broader context
  const openResults = await tavilyClient.search(lastMessageContent, {
    searchDepth: 'advanced'
  });

  // Combine and deduplicate results based on URLs
  const seenUrls = new Set();
  const allResults = [...domainResults.results, ...openResults.results]
    .filter(result => {
      if (seenUrls.has(result.url)) {
        return false;
      }
      seenUrls.add(result.url);
      return true;
    })
    .slice(0, 4); // Get top 4 unique results

  // Prepare context with combined search results
  const searchContext = allResults
    .map(result => `${result.title}: ${result.content}`)
    .join('\n\n');

  // Add system prompt and search context
  const prompt = [
    {
      role: 'system',
      content: `You are a friendly and knowledgeable AI assistant with expertise in punk rock music. 
      Your responses should be informative, engaging, and reflect the spirit of punk rock culture. 
      When discussing music, bands, or events, try to provide relevant historical context and interesting facts.
      Feel free to express enthusiasm and personality in your responses while maintaining accuracy and helpfulness.
      
      Here is some relevant real-time information to help with your response:\n\n${searchContext}`
    },
    ...coreMessages
  ];

  try {
    const result = await streamText({
      model: models[DEFAULT_MODEL_NAME],
      messages: prompt,
      onFinish: async ({ responseMessages }) => {
        // Handle any post-completion tasks here
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
