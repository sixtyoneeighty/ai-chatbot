import { Message, convertToCoreMessages } from 'ai';
import { tavily } from '@tavily/core';
import { auth } from '@/app/(auth)/auth';
import { systemPrompt } from '@/lib/ai/prompts';
import { google } from '@ai-sdk/google';

// Initialize Tavily
const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY! });

// Initialize Google AI with Vercel AI SDK
const googleAI = google('gemini-pro');

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
    const searchResponse = await tavilyClient.search(lastMessage, {
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

    // Prepare context with search results
    const searchContext = searchResponse.results
      .slice(0, 3)
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

    // Use the Vercel AI SDK to stream the response
    const response = await googleAI.streamText({
      messages: prompt
    });

    return response;

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
