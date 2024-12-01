import {
  type Message,
  StreamData,
  convertToCoreMessages,
} from 'ai';
import { z } from 'zod';

import { auth } from '@/app/(auth)/auth';
import { openai } from '@/lib/ai';
import { models } from '@/lib/ai/models';
import { systemPrompt } from '@/lib/ai/prompts';
import { TavilySearchAPI } from '@/lib/tavily';
import { TavilySearchAPIParameters } from '@/lib/types';
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
} from '@/lib/db/queries';
import {
  generateUUID,
  getMostRecentUserMessage,
  sanitizeResponseMessages,
} from '@/lib/utils';

import { generateTitleFromUserMessage } from '../../actions';

// Initialize Tavily client
const tavily = new TavilySearchAPI(process.env.TAVILY_API_KEY || '');

// Define Tavily function schema
const tavilyFunction = {
  name: "tavily_search",
  description: "Search for the latest music news, band updates, and punk rock history.",
  parameters: {
    type: "object",
    properties: {
      query: { 
        type: "string", 
        description: "The search query about music, bands, or punk rock culture." 
      },
      includeDetails: {
        type: "boolean",
        description: "Whether to include detailed results.",
        default: false,
      },
    },
    required: ["query"],
  },
};

// Tavily search function
async function performTavilySearch(args: TavilySearchAPIParameters) {
  try {
    const results = await tavily.search(args);
    return results;
  } catch (error) {
    console.error("Tavily search error:", error);
    return {
      results: [],
      answer: "Search failed, but I'll work with what I know.",
      query: args.query
    };
  }
}

export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { messages, modelId } = json;

    const session = await auth();
    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const model = models.find((m) => m.id === modelId);
    if (!model) {
      return new Response('Model not found', { status: 404 });
    }

    const chatId = json.id ?? generateUUID();
    const title = json.title ?? null;

    try {
      const chat = await getChatById(chatId);
      if (!chat) {
        if (!session?.user?.id) {
          return new Response('Unauthorized', { status: 401 });
        }
        await saveChat({
          id: chatId,
          title: title ?? 'New Chat',
          userId: session.user.id,
        });
      }

      // First, check if we need to search
      const searchCheckResponse = await openai.chat.completions.create({
        model: model.apiIdentifier,
        messages: [
          {
            role: "system",
            content: "You are a punk rock expert. If the user's question might benefit from real-time information (like recent news, tour dates, or releases), respond with a search query. Otherwise, respond with 'no search needed'."
          },
          {
            role: "user",
            content: messages[messages.length - 1].content
          }
        ],
        temperature: 0.7,
        max_output_tokens: 1024,
        stream: true,
        tools: [
          {
            functionDeclarations: [tavilyFunction]
          }
        ]
      });

      // Get the response content
      const searchCheckContent = await streamToString(searchCheckResponse.stream);
      
      // If search is needed, perform it
      let searchResults = null;
      if (searchCheckContent && !searchCheckContent.includes('no search needed')) {
        searchResults = await performTavilySearch({
          query: searchCheckContent,
          includeDetails: true
        });
      }

      // Now create the main chat completion
      const response = await openai.chat.completions.create({
        model: model.apiIdentifier,
        messages: [
          {
            role: "system",
            content: systemPrompt + (searchResults ? `\nSearch results: ${JSON.stringify(searchResults)}` : '')
          },
          ...convertToCoreMessages(messages)
        ],
        temperature: 0.7,
        max_output_tokens: 1024,
        stream: true
      });

      // Save messages to the database
      const userMessage = messages[messages.length - 1];
      if (userMessage && userMessage.role === 'user') {
        await saveMessages([
          {
            id: generateUUID(),
            chatId,
            role: userMessage.role,
            content: userMessage.content,
            createdAt: new Date(),
          },
        ]);

        // Generate and update chat title if it's the first message
        if (messages.length === 1) {
          const title = await generateTitleFromUserMessage(userMessage.content);
          if (title && session?.user?.id) {
            await saveChat({
              id: chatId,
              title,
              userId: session.user.id,
            });
          }
        }
      }

      return new Response(response.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    } catch (error) {
      console.error('Error in chat processing:', error);
      
      // Check if error is an OpenAI API error
      const err = error as { response?: { status: number }; message?: string };
      if (err.response?.status === 429) {
        return new Response('Rate limit exceeded. Please try again later.', { status: 429 });
      }

      return new Response(err.message || 'Error processing chat', { 
        status: 500,
      });
    }
  } catch (error) {
    console.error('Error parsing request:', error);
    return new Response('Invalid request format', { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get('id');

  if (!chatId) {
    return new Response('Missing chat ID', { status: 400 });
  }

  try {
    await deleteChatById({ id: chatId });
    return new Response('OK');
  } catch (error) {
    console.error('Error deleting chat:', error);
    return new Response('Error deleting chat', { status: 500 });
  }
}
