import { Message, convertToCoreMessages, StreamingTextResponse } from 'ai';
import { tavily } from '@tavily/core';
import { auth } from '@/app/(auth)/auth';
import { systemPrompt } from '@/lib/ai/prompts';
import { model } from '@/lib/ai/models';

// Initialize Tavily
const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY! });

export const maxDuration = 60;

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { messages } = await req.json();
  const coreMessages = convertToCoreMessages(messages);

  try {
    // Get real-time information using Tavily
    const lastMessage = messages[messages.length - 1].content;
    
    // Perform domain-specific search
    const punkSearch = await tavilyClient.search(lastMessage, {
      searchDepth: "advanced",
      includeAnswer: true,
      includeDomains: [
        "punknews.org",
        "nofx.org",
        "fatwreck.com",
        "epitaph.com",
        "altpress.com",
        "brooklynvegan.com",
        "pitchfork.com"
      ]
    });

    // Perform open search
    const openSearch = await tavilyClient.search(lastMessage, {
      searchDepth: "advanced",
      includeAnswer: true
    });

    // Combine and deduplicate results based on URL
    const seenUrls = new Set();
    const allResults = [...punkSearch.results, ...openSearch.results]
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

    // Prepare messages with system prompt and search context
    const prompt = [
      { role: 'system', content: systemPrompt },
      ...coreMessages,
      { 
        role: 'system', 
        content: `Here is some relevant real-time information to help with your response:\n\n${searchContext}`
      }
    ];

    // Use the Google AI model to generate a streaming response
    const response = await model.generateText({
      prompt: prompt.map(m => m.content).join('\n'),
      stream: true
    });

    // Return a streaming response
    return new StreamingTextResponse(response);

  } catch (error) {
    console.error('Error in chat route:', error);
    return new Response('Error processing chat request', { status: 500 });
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
