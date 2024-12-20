import { customModel } from './index';

export const DEFAULT_MODEL_NAME = 'gemini-exp-1206';

const geminiModel = customModel('gemini-exp-1206');

// Export models as both array and object for different use cases
export const modelsList = [
  { id: 'gemini-exp-1206', name: 'Gemini', model: geminiModel }
];

export const models = {
  'gemini-exp-1206': geminiModel
};
