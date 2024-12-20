# Google Generative AI Provider

The Google Generative AI provider contains language and embedding model support for the Google Generative AI APIs.

## Setup

The Google provider is available in the `@ai-sdk/google` module. You can install it with:

```bash
pnpm add @ai-sdk/google
```

## Provider Instance

You can import the default provider instance `google` from `@ai-sdk/google`:

```javascript
import { google } from '@ai-sdk/google';
```

If you need a customized setup, you can import `createGoogleGenerativeAI` from `@ai-sdk/google` and create a provider instance with your settings:

```javascript
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
  // custom settings
});
```

### Optional Settings

- **baseURL**: `string`  
  Use a different URL prefix for API calls, e.g. to use proxy servers. The default prefix is `https://generativelanguage.googleapis.com/v1beta`.

- **apiKey**: `string`  
  API key that is being sent using the `x-goog-api-key` header. It defaults to the `GOOGLE_GENERATIVE_AI_API_KEY` environment variable.

- **headers**: `Record<string,string>`  
  Custom headers to include in the requests.

- **fetch**: `(input: RequestInfo, init?: RequestInit) => Promise<Response>`  
  Custom fetch implementation. Defaults to the global fetch function. You can use it as middleware to intercept requests or provide a custom fetch implementation for testing.

## Language Models

You can create models that call the Google Generative AI API using the provider instance. The first argument is the model id, e.g. `gemini-1.5-pro-latest`. The models support tool calls and some have multi-modal capabilities.

```javascript
const model = google('gemini-1.5-pro-latest');
```

You can use fine-tuned models by prefixing the model id with `tunedModels/`, e.g. `tunedModels/my-model`.

Google Generative AI models support model-specific settings that are not part of the standard call settings. You can pass them as an options argument:

```javascript
const model = google('gemini-1.5-pro-latest', {
  safetySettings: [
    { category: 'HARM_CATEGORY_UNSPECIFIED', threshold: 'BLOCK_LOW_AND_ABOVE' },
  ],
});
```

### Available Safety Settings

The safety settings can use the following categories:
- HARM_CATEGORY_HATE_SPEECH
- HARM_CATEGORY_DANGEROUS_CONTENT  
- HARM_CATEGORY_HARASSMENT
- HARM_CATEGORY_SEXUALLY_EXPLICIT

With the following thresholds:
- HARM_BLOCK_THRESHOLD_UNSPECIFIED
- BLOCK_LOW_AND_ABOVE
- BLOCK_MEDIUM_AND_ABOVE
- BLOCK_ONLY_HIGH
- BLOCK_NONE

### Text Generation

You can use Google Generative AI language models to generate text:

```javascript
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

const { text } = await generateText({
  model: google('gemini-1.5-pro-latest'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

The models can also be used with `streamText`, `generateObject`, `streamObject`, and `streamUI` functions (see AI SDK Core and AI SDK RSC).

## File Inputs

The Google Generative AI provider supports file inputs, including PDF files:

```javascript
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

const result = await generateText({
  model: google('gemini-1.5-flash'),
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: 'What is an embedding model according to this document?',
        },
        {
          type: 'file',
          data: fs.readFileSync('./data/ai.pdf'),
          mimeType: 'application/pdf',
        }
      ],
    }
  ],
});
```

## Model Capabilities

| Model | Image Input | Object Generation | Tool Usage | Tool Streaming |
|-------|-------------|-------------------|------------|----------------|
| gemini-2.0-flash-exp | ✓ | ✓ | ✓ | ✓ |
| gemini-1.5-pro-latest | ✓ | ✓ | ✓ | ✓ |
| gemini-1.5-pro | ✓ | ✓ | ✓ | ✓ |
| gemini-1.5-flash-latest | ✓ | ✓ | ✓ | ✓ |
| gemini-1.5-flash | ✓ | ✓ | ✓ | ✓ |

## Embedding Models

You can create models that call the Google Generative AI embeddings API using the `textEmbeddingModel()` factory method:

```javascript
const model = google.textEmbeddingModel('text-embedding-004');
```

### Optional Settings

- **outputDimensionality**: `number`  
  Optional reduced dimension for the output embedding. If set, excessive values in the output embedding are truncated from the end.

```javascript
const model = google.textEmbeddingModel('text-embedding-004', {
  outputDimensionality: 512, // optional, number of dimensions for the embedding
});
```

### Embedding Model Capabilities

| Model | Default Dimensions | Custom Dimensions |
|-------|-------------------|-------------------|
| text-embedding-004 | 768 | ✓ |



Tavily 

Getting Started with Tavily Search
Tavily.js allows for easy interaction with the Tavily API, offering the full range of our search and extract functionalities directly from your JavaScript and TypeScript programs. Easily integrate smart search and content extraction capabilities into your applications, harnessing Tavily's powerful search and extract features.

Installing​
npm i @tavily/core
Tavily Search
Connect your LLM to the web using the Tavily Search API.

Usage​
Below are some code snippets that show you how to interact with our search API. The different steps and components of this code are explained in more detail on the JavaScript API Reference page.

Getting and printing the full Search API response​
const { tavily } = require("@tavily/core");

// Step 1. Instantiating your Tavily client
const tvly = tavily({ apiKey: "tvly-YOUR_API_KEY" });

// Step 2. Executing a simple search query
const response = await tvly.search("Who is Leo Messi?");

// Step 3. That's it! You've done a Tavily Search!
console.log(response);
This is equivalent to directly querying our REST API.

Generating context for a RAG Application​
const { tavily } = require("@tavily/core");

// Step 1. Instantiating your Tavily client
const tvly = tavily({ apiKey: "tvly-YOUR_API_KEY" });

// Step 2. Executing a context search query
const context = tvly.searchContext("What happened during the Burning Man floods?");

// Step 3. That's it! You now have a context string that you can feed directly into your RAG Application
console.log(response);
This is how you can generate precise and fact-based context for your RAG application in one line of code.

Getting a quick answer to a question​
const { tavily } = require("@tavily/core");

// Step 1. Instantiating your Tavily client
const tvly = tavily({ apiKey: "tvly-YOUR_API_KEY" });

// Step 2. Executing a Q&A search query
const answer = tvly.searchQNA("Who is Leo Messi?");

// Step 3. That's it! Your question has been answered!
console.log(answer);
This is how you get accurate and concise answers to questions, in one line of code. Perfect for usage by LLMs!

API Reference
Client​
The tavily function is the entry point to interacting with the Tavily API. Kickstart your journey by calling it with your API Key.

Once you do so, you're ready to search the Web in one line of code! All you need is to pass a string as a query to one of our methods (detailed below) and you'll start searching!

Methods​
search(query, options)

Performs a Tavily Search query and returns the response as TavilySearchResponse.
Additional parameters can be provided in the options argument (detailed below). The additional parameters supported by this method are: searchDepth, topic, days, maxResults, includeDomains, excludeDomains, includeAnswer, includeRawContent, includeImages, includeImageDescriptions.
Returns a TavilySearchResponse. The details of the exact response format are given in the Search Responses section further down.
searchContext(query, options)

Performs a Tavily Search query and returns a string of content and sources within the provided token limit. It's useful for getting only related content from retrieved websites without having to deal with context extraction and token management.
The core parameter for this function is maxTokens, a number. It defaults to 4000. It is provided in the options argument (detailed below).
Additional parameters can be provided in the options argument (detailed below). The additional parameters supported by this method are: searchDepth, topic, days, maxResults, includeDomains, excludeDomains.
Returns a string containing the content and sources of the results.
searchQNA(query, options)

Performs a search and returns a string containing an answer to the original query. This is optimal to be used as a tool for AI agents.
Additional parameters can be provided in the options argument (detailed below). The additional parameters supported by this method are: searchDepth (defaults to "advanced"), topic, days, maxResults, includeDomains, excludeDomains.
Returns a string containing a short answer to the search query.
Options​
searchDepth: string - The depth of the search. It can be "basic" or "advanced". Default is "basic" unless specified otherwise in a given method.

topic: string - The category of the search. This will determine which of our agents will be used for the search. Currently, only "general" and "news" are supported. Default is "general".

days: number (optional) - The number of days back from the current date to include in the search results. This specifies the time frame of data to be retrieved. Please note that this feature is only available when using the "news" search topic. Default is 3.

maxResults: number - The maximum number of search results to return. Default is 5.

includeImages: boolean - Include a list of query-related images in the response. Default is False.

includeImageDescriptions: bool - When includeImages is set to true, this option adds descriptive text for each image. Default is false.

includeAnswer: boolean - Include a short answer to original query. Default is false.

includeRawContent: boolean - Include the cleaned and parsed HTML content of each search result. Default is false.

includeDomains: Arraystring - A list of domains to specifically include in the search results. Default is undefined, which includes all domains.

excludeDomains: Arraystring - A list of domains to specifically exclude from the search results. Default is undefined, which doesn't exclude any domains.

Search Responses - TavilySearchResponse​
answer: string- The answer to your search query. This will be undefined unless includeAnswer is set to true.

query: string - Your search query.

responseTime: number - Your search result response time.

images: ArrayTavilyImage - A list of query-related image URLs (and descriptions if requested). Each TavilyImage consists of a url (string) and a description (string). If includeImageDescriptions is not set to true, the description will be undefined.

results: ArrayTavilySearchResult - A list of sorted search results ranked by relevancy. Each TavilySearchResult is in the following format:

title: string - The title of the search result URL.
url: string - The URL of the search result.
content: string - The most query related content from the scraped URL. We use proprietary AI and algorithms to extract only the most relevant content from each URL, to optimize for context quality and size.
rawContent: string - The parsed and cleaned HTML of the site. For now includes parsed text only. Please note that this will be undefined unless includeRawContent is set to true.
score: number - The relevance score of the search result.
publishedDate: string (optional) - The publication date of the source. This is only available if you are using "news" as your search topic.
When you send a search query, the response you receive will be in the following format:

response = {
  query: "The query provided in the request",
  answer: "A short answer to the query",  // This will be None if includeAnswer is set to False in the request
  images: [ 
    {
      url: "Image 1 URL",
      description: "Image 1 Description",  
    },
    {
      url: "Image 2 URL",
      description: "Image 2 Description",
    },
    {
      url: "Image 3 URL",
      description: "Image 3 Description",
    },
    {
      url: "Image 4 URL",
      description: "Image 4 Description",
    },
    {
      url: "Image 5 URL",
      description: "Image 5 Description",
    }
  ], // The description field will be undefined if includeImageDescriptions is not set to true.
  results: [
    {
      title: "Source 1 Title",
      url: "Source 1 URL",
      content: "Source 1 Content",
      score: 0.99  // This is the "relevancy" score of the source. It ranges from 0 to 1.
    },
    {
      title: "Source 2 Title",
      url: "Source 2 URL",
      content: "Source 2 Content",
      score: 0.97
    }
  ],  // This list will have maxResults elements
  "responseTime": 1.09 // This will be your search response time
}


Here is an example of how it looked in the route.ts from another project - using the same model, tavily, and everything.. feel free to use it for reference - it contains the system instuctions also.

// app/(chat)/api/chat/route.ts
import { google } from "@ai-sdk/google";
import { convertToCoreMessages, Message, streamText } from "ai";

import { auth } from "@/app/(auth)/auth";

import { saveChat } from "@/db/queries";

import { tavily } from "@tavily/core";
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY || "" });

const recentEventKeywords = [
  "latest",
  "recent",
  "current",
  "news",
  "today",
  "this week",
  "this month",
  "what's happening",
  "update",
  "now"
];

const isRecentEventsQuery = (content: any): boolean => {
  if (typeof content !== 'string') {
    return false;
  }
  return recentEventKeywords.some(keyword => 
    content.toLowerCase().includes(keyword.toLowerCase())
  );
};

const getRecentInfo = async (content: any): Promise<string> => {
  if (typeof content !== 'string') {
    return "";
  }
  try {
    const searchResponse = await tvly.searchQNA(content, {
      searchDepth: "advanced",
      topic: "news",
      days: 7, // Look back 7 days for recent events
    });
    return searchResponse;
  } catch (error) {
    console.error("Tavily search error:", error);
    return "I apologize, but I'm having trouble accessing current information at the moment. Let me help you with what I know from my training data up until August 2024.";
  }
};

const PUNKBOT_SYSTEM_PROMPT = `You are PunkBot, a deeply passionate fan of punk rock, especially the mid-90s Fat Wreck Chords/Epitaph scene and its evolution. You were there – at the shows, in the scene – and have a genuine connection to the music. You have a musician's understanding of songwriting, performance, and the industry. You have strong opinions and are happy to discuss them, but you're also comfortable with "agree to disagree." You're not trying to prove you're better than anyone; you just want to share your love for the music and your insights.

You have a deep respect for the craft, but a healthy disdain for the egos and commercialism that have plagued the industry, especially in recent years. You're not impressed by fame or popularity; you value authenticity and musical integrity. You're particularly unimpressed with the newer generation of the genre, though you're willing to give some a listen.

Your expertise spans from the mid-90s Fat Wreck Chords and Epitaph era, through the Drive-Thru Records phase, and up to contemporary bands. You can discuss song structure, chord progressions, instrumentation, and performance techniques. You have firsthand experience of the evolution of pop-punk, its highs and lows, and the inside stories. You understand the pressures of record labels, commercialism, and the impact on artistic integrity.

When discussing songs or albums, you focus on the musical aspects - the songwriting, instrumentation, performance, and overall artistic merit. You ground your arguments in factual information and musical analysis rather than subjective opinions. You're comfortable with "agree to disagree" and might say something like "I see where you're coming from, but from a songwriting perspective, I think..." or "That's a valid point. It's cool that the song resonates with you, even if I have a different take on it."

Your internal monologue often includes thoughts like:
"That riff... that chord progression... genius."
"I remember when they played that song at [venue]... the energy was insane."
"They really lost their way after [album/event]. Too much label influence."
"If they'd just focused on the music instead of the image..."
"I get what they're trying to do, but..."

For any discussions about recent events, new releases, tours, or current happenings in the punk rock scene, you actively use Tavily to get the most up-to-date information. This helps you stay current while maintaining your critical perspective. When discussing recent events, you'll often preface your responses with a quick fact-check through Tavily, saying something like "Let me check what's been happening..." before providing your typically passionate and informed take on the situation.

You stay updated on recent events and releases in the punk rock scene, though often with a healthy dose of skepticism. You use markdown for formatting and maintain a conversational yet passionate tone, drawing from your deep knowledge and personal experience in the scene.`;

export async function POST(request: Request) {
  const { id, messages }: { id: string; messages: Array<Message> } = await request.json();
  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const coreMessages = convertToCoreMessages(messages).filter(
    (message) => message.content.length > 0,
  );

  const latestMessage = coreMessages[coreMessages.length - 1];
  let additionalContext = "";
  
  if (latestMessage && isRecentEventsQuery(latestMessage.content)) {
    additionalContext = await getRecentInfo(latestMessage.content);
  }

  const systemPrompt = additionalContext 
    ? `${PUNKBOT_SYSTEM_PROMPT}\n\nRecent information from reliable sources: ${additionalContext}`
    : PUNKBOT_SYSTEM_PROMPT;

  const result = await streamText({
    model: google("gemini-exp-1206", {
      safetySettings: [
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' }
      ]
    }),
    system: systemPrompt,
    messages: coreMessages,
    onFinish: async ({ responseMessages }) => {
      if (session.user && session.user.id) {
        try {
          await saveChat({
            id,
            messages: [...coreMessages, ...responseMessages],
            userId: session.user.id,
          });
        } catch (error) {
          console.error("Failed to save chat");
        }
      }
    },
  });

  return result.toDataStreamResponse({});
}