import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { experimental_wrapLanguageModel as wrapLanguageModel } from 'ai';

// Check for API key at runtime
const getGoogleAIClient = () => {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing GOOGLE_GENERATIVE_AI_API_KEY environment variable');
  }
  return createGoogleGenerativeAI({ apiKey });
};

// Create model with runtime API key check
export const createModel = (apiIdentifier: string) => {
  const google = getGoogleAIClient();
  const model = google(apiIdentifier, {
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' }
    ]
  });
  
  return wrapLanguageModel({
    model,
    middleware: {}
  });
};

// Re-export for backward compatibility
export const customModel = createModel;
