import { Message, convertToCoreMessages, StreamingTextResponse } from 'ai';
import { TavilySearchAPIClient } from '@tavily/core';
import { auth } from '@/app/(auth)/auth';
import { models } from '@/lib/ai/models';

// Initialize Tavily
const tavilyClient = new TavilySearchAPIClient(process.env.TAVILY_API_KEY || '');

export const maxDuration = 60;

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { messages, modelName = 'gemini-exp-1206' } = await req.json();
  const model = models[modelName];

  const coreMessages = convertToCoreMessages(messages);
  const prompt = [...coreMessages];
  const lastMessage = prompt[prompt.length - 1].content;

  // Perform a domain-specific search focused on punk rock
  const domainResults = await tavilyClient.search({
    query: lastMessage,
    searchDepth: 'advanced',
    includeUrls: [
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
  const openResults = await tavilyClient.search({
    query: lastMessage,
    searchDepth: 'advanced'
  });

  // Combine and deduplicate results based on URLs
  const seenUrls = new Set();
  const combinedResults = [...domainResults, ...openResults].filter(result => {
    if (seenUrls.has(result.url)) {
      return false;
    }
    seenUrls.add(result.url);
    return true;
  });

  // Add search results to the prompt
  if (combinedResults.length > 0) {
    prompt.unshift({
      role: 'system',
      content: `Here are some relevant search results for context:\n\n${combinedResults
        .map(
          result => `Title: ${result.title}\nContent: ${result.content}\nURL: ${result.url}\n`
        )
        .join('\n')}`
    });
  }

  // Add system prompt
  prompt.unshift({
    role: 'system',
    content: `You are a friendly and knowledgeable AI assistant with expertise in punk rock music. 
    Your responses should be informative, engaging, and reflect the spirit of punk rock culture. 
    When discussing music, bands, or events, try to provide relevant historical context and interesting facts.
    Feel free to express enthusiasm and personality in your responses while maintaining accuracy and helpfulness.`
  });

  try {
    // Use the Google AI model to generate a streaming response
    const stream = await model.generateContentStream({
      contents: prompt.map(m => ({ role: m.role, parts: [{ text: m.content }] }))
    });

    // Convert the response to a ReadableStream
    return new StreamingTextResponse(stream);
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
