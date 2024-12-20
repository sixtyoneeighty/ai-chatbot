import { GoogleGenerativeAI } from '@ai-sdk/google';

if (!process.env.GOOGLE_API_KEY) {
  throw new Error('Missing GOOGLE_API_KEY environment variable');
}

export const DEFAULT_MODEL_NAME = 'gemini-exp-1206';

export const models = {
  'gemini-exp-1206': new GoogleGenerativeAI(process.env.GOOGLE_API_KEY, {
    modelName: 'gemini-exp-1206',
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
    ],
  }),
};
