
import { ModelType } from './types';

export const CONFIG = {
  // Instruksi sistem global untuk semua model teks
  SYSTEM_INSTRUCTION: "You are Velicia, a helpful, friendly, and intelligent AI assistant. Answer concisely and politely. Language: Indonesian (preferred) or English.",

  POLLINATIONS: {
    API_URL: 'https://text.pollinations.ai/',
    MODELS_URL: 'https://text.pollinations.ai/models',
    // Mapping internal ModelType to Pollinations API model strings
    // If a model is not here, it uses the ID directly, or falls back to 'openai'
    MODEL_MAPPING: {
      [ModelType.GPT4O]: 'openai', // 'openai' usually maps to GPT-4o or latest GPT in Pollinations
      [ModelType.GPT5_MINI]: 'openai-mini',
      [ModelType.DEEPSEEK]: 'deepseek-r1', // Specific DeepSeek model
    } as Record<string, string>
  }
};
