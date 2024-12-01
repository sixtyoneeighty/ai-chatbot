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
        functions: [tavilyFunction],
        temperature: 0.7,
      });

      let searchResults = null;
      const functionCall = searchCheckResponse.choices[0]?.message?.function_call;
      
      if (functionCall?.name === "tavily_search") {
        try {
          const args = JSON.parse(functionCall.arguments || "{}");
          if (args.query) {
            searchResults = await performTavilySearch(args);
          }
        } catch (searchError) {
          console.error("Error in Tavily search:", searchError);
          searchResults = null;
        }
      }

      // Format messages for final response
      const formattedMessages = [
        { role: 'system', content: systemPrompt },
        ...convertToCoreMessages(messages).map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
      ];

      if (searchResults) {
        formattedMessages.push({
          role: 'function',
          content: JSON.stringify({
            name: 'tavily_search',
            content: searchResults
          }),
        });
      }

      const response = await openai.chat.completions.create({
        model: model.apiIdentifier,
        messages: formattedMessages,
        stream: true,
        temperature: 0.9,
      });

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          const chunks: Array<string> = [];

          try {
            for await (const chunk of response) {
              const content = chunk.choices[0]?.delta?.content || '';
              if (content) {
                chunks.push(content);
                controller.enqueue(encoder.encode(content));
              }
            }

            const fullResponse = chunks.join('');
            await saveMessages(
              chatId,
              sanitizeResponseMessages([
                ...messages,
                { role: 'assistant', content: fullResponse },
              ])
            );

            if (!title) {
              const mostRecentUserMessage = getMostRecentUserMessage(messages);
              if (mostRecentUserMessage) {
                const generatedTitle = await generateTitleFromUserMessage({
                  message: mostRecentUserMessage,
                });

                await saveChat({
                  id: chatId,
                  title: generatedTitle,
                  userId: session.user.id,
                });
              }
            }
          } catch (error) {
            console.error('Error in stream processing:', error);
            controller.error(error);
          } finally {
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      });
    } catch (error) {
      console.error('Error in chat processing:', error);
      if (error.response?.status === 429) {
        return new Response('Rate limit exceeded. Please try again later.', { status: 429 });
      }
      return new Response(error.message || 'Error processing chat', { 
        status: error.response?.status || 500 
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
    await deleteChatById(chatId);
    return new Response('OK');
  } catch (error) {
    console.error('Error deleting chat:', error);
    return new Response('Error deleting chat', { status: 500 });
  }
}
