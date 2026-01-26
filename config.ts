
import { ModelType } from './types';

export const CONFIG = {
  // Instruksi sistem global untuk semua model teks
  SYSTEM_INSTRUCTION: "You are Velicia, a helpful, friendly, and intelligent AI assistant. You answer concisely and politely. Current language context: Indonesian/English.",

  POLLINATIONS: {
    API_URL: 'https://text.pollinations.ai/',
    MODELS_URL: 'https://text.pollinations.ai/models',
    // Mapping internal ModelType to Pollinations API model strings (fallback)
    MODEL_MAPPING: {
      [ModelType.GPT4O]: 'gpt-4o',
      [ModelType.DEEPSEEK]: 'deepseek',
    } as Record<string, string>
  }
};
