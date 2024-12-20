import { Message, convertToCoreMessages, streamText } from 'ai';
import { tavily } from '@tavily/core';
import { auth } from '@/app/(auth)/auth';
import { model } from '@/lib/ai/models';
import { systemPrompt } from '@/lib/ai/prompts';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateUUID } from '@/lib/utils';
import { saveChat, saveMessages, getChatById, deleteChatById } from '@/lib/db/queries';
import { generateTitleFromUserMessage } from '../../actions';

// Initialize Tavily
const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY! });

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export const maxDuration = 60;

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { messages, modelId } = await req.json();
  const coreMessages = convertToCoreMessages(messages);

  try {
    // Get real-time information using Tavily
    const lastMessage = messages[messages.length - 1].content;
    const searchResponse = await tavilyClient.search({
      query: lastMessage,
      search_depth: "advanced",
    });

    // Prepare context with search results
    const searchContext = searchResponse.results
      .slice(0, 3)
      .map(result => `${result.title}: ${result.content}`)
      .join('\n\n');

    // Create the chat model
    const chat = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = [
      { role: 'system', content: systemPrompt },
      ...coreMessages,
      { 
        role: 'system', 
        content: `Here is some relevant real-time information to help with your response:\n\n${searchContext}`
      }
    ];

    const result = await chat.generateContentStream({
      contents: [{ role: 'user', text: prompt.map(m => m.content).join('\n') }],
    });

    // Stream the response
    return new Response(streamText(result), {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

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
