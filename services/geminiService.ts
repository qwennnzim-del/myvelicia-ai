
import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import { Message, Role, Attachment, GroundingMetadata, ModelType } from '../types';
import { CONFIG } from '../config';

let chatSession: Chat | null = null;
let currentModel: string | null = null;

// Empty unused image models
export const IMAGE_MODELS: string[] = [];

interface AIResponse {
  text: string;
  groundingMetadata?: GroundingMetadata;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const initializeGeminiChat = (modelId: string, customSystemInstruction?: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Fallback map to ensure we use real Gemini models even if IDs differ
  let actualModel = 'gemini-3-flash-preview';
  if (modelId === ModelType.GEMINI_3_PRO) actualModel = 'gemini-3-pro-preview';
  if (modelId === ModelType.GEMINI_2_5_FLASH) actualModel = 'gemini-2.5-flash';

  chatSession = ai.chats.create({
    model: actualModel,
    config: {
      systemInstruction: customSystemInstruction || CONFIG.SYSTEM_INSTRUCTION,
      tools: [{ googleSearch: {} }],
    },
  });
  currentModel = modelId;
};

export const sendMessageToGemini = async (
  text: string, 
  modelId: string,
  history: Message[],
  attachment?: Attachment
): Promise<AIResponse> => {
  try {
    if (!chatSession || currentModel !== modelId) {
        initializeGeminiChat(modelId);
    }

    if (!chatSession) throw new Error("Chat session not initialized");

    const currentParts: any[] = [];
    if (attachment) {
      const base64Data = attachment.content.split(',')[1]; 
      currentParts.push({ inlineData: { mimeType: attachment.mimeType, data: base64Data } });
    }
    if (text) currentParts.push({ text: text });

    let attempt = 0;
    const maxRetries = 2;

    while (attempt <= maxRetries) {
        try {
            const response: GenerateContentResponse = await chatSession.sendMessage({ message: attachment ? currentParts : text });
            
            return { 
                text: response.text || "Maaf, tidak ada respons.",
                groundingMetadata: response.candidates?.[0]?.groundingMetadata as GroundingMetadata
            };
        } catch (error: any) {
            if (error.status === 503 || error.status === 429 || error.message?.includes('429')) {
                attempt++;
                if (attempt <= maxRetries) {
                    await delay(1500 * attempt);
                    continue;
                }
            }
            throw error; 
        }
    }
    
    throw new Error("Failed to get response after retries.");

  } catch (error: any) {
    console.error("Service Error:", error);
    
    if (error.message?.includes('403') || error.status === 'PERMISSION_DENIED') {
         if (typeof window !== 'undefined' && (window as any).aistudio) {
             try { await (window as any).aistudio.openSelectKey(); } catch (e) {}
             return { text: "⚠️ **Akses Ditolak**. Silakan pilih API Key yang valid." };
         }
    }

    if (error.message?.includes('429') || error.message?.includes('Quota exceeded')) {
        return { text: "⚠️ **Kuota Habis**. Mohon tunggu sebentar." };
    }

    return { text: `⚠️ Maaf, terjadi kesalahan saat memproses permintaan. (${error.message})` };
  }
};

// Placeholder for unused functionality
export const generatePresentationImage = async (prompt: string): Promise<string> => {
    return ""; 
};
