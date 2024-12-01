// Define your models here.

export const models = [
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    description: 'Most capable Gemini model for a wide range of tasks',
    apiIdentifier: 'gemini-1.5-pro',
    contextWindow: 32768,
    maxTokens: 2048,
  },
] as const;

export type Model = (typeof models)[number];

export const DEFAULT_MODEL_NAME: string = 'gemini-1.5-pro';
