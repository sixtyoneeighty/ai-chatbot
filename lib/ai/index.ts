import OpenAI from 'openai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY environment variable');
}

export const openai = new OpenAI({ 
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1/models',
  defaultHeaders: {
    'Content-Type': 'application/json',
    'x-goog-api-key': process.env.GEMINI_API_KEY,
  },
});

export const defaultModel = 'gemini-1.5-pro';

import { experimental_wrapLanguageModel as wrapLanguageModel } from 'ai';

import { customMiddleware } from './custom-middleware';

export const customModel = (apiIdentifier: string) => {
  return wrapLanguageModel({
    model: openai,
    middleware: customMiddleware,
  });
};
