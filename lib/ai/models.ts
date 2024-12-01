// Define your models here.

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
}

export const models: Array<Model> = [
  {
    id: 'gemini-1.5-pro',
    label: 'Punk Rock Chatbot',
    apiIdentifier: 'gemini-1.5-pro',
    description: 'The punkest chatbot you ever did see',
  }
] as const;

export const DEFAULT_MODEL_NAME: string = 'gemini-1.5-pro';
