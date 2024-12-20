import { createGoogleGenerativeAI } from '@ai-sdk/google';

if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  throw new Error('Missing GOOGLE_GENERATIVE_AI_API_KEY environment variable');
}

export const DEFAULT_MODEL_NAME = 'gemini-exp-1206';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
});

const geminiModel = google('gemini-exp-1206', {
  safetySettings: [
    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' }
  ]
});

// Export models as both array and object for different use cases
export const modelsList = [
  { id: 'gemini-exp-1206', name: 'Gemini', model: geminiModel }
];

export const models = {
  'gemini-exp-1206': geminiModel
};
