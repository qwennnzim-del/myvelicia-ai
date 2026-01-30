
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Message, ModelType, GroundingMetadata, Attachment } from '../types';
import { CONFIG } from '../config';
import { sendToPollinations } from './pollinationsService';

// Exported IMAGE_MODELS to fix the missing member error in MessageList.tsx
export const IMAGE_MODELS = ['gemini-2.5-flash-image', 'gemini-3-pro-image-preview', 'imagen-4.0-generate-001'];

let chatSession: Chat | null = null;
let currentModel: string | null = null;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Always use { apiKey: process.env.API_KEY } for initialization
const initializeGeminiChat = (modelId: string, customSystemInstruction?: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let instruction = customSystemInstruction || CONFIG.SYSTEM_INSTRUCTION;

  // Configuration for specific models
  if (modelId === ModelType.VELICIA_PRO) {
    instruction = CONFIG.DEEP_REASONING_INSTRUCTION;
  }
  
  // Mapping logic: Ensure 'velicia-v5' maps to a valid engine ID internally
  // We use gemini-2.0-flash as the engine for v5 to provide O1-class speed and intelligence
  // UPDATE: This acts as a fallback or initialization placeholder. Actual routing happens in sendMessageToGemini.
  const actualModelId = (modelId === ModelType.VELICIA_V5) ? 'gemini-2.0-flash' : modelId;
  
  // Use the requested model IDs directly as they are allowed
  chatSession = ai.chats.create({
    model: actualModelId,
    config: {
      systemInstruction: instruction,
      tools: [{ googleSearch: {} }],
    },
  });
  currentModel = modelId;
};

export const sendMessageToGemini = async (
  text: string, 
  modelId: string,
  history: Message[],
  attachments?: Attachment[]
): Promise<{ text: string; groundingMetadata?: GroundingMetadata }> => {
  try {
    
    // --- ROUTING LOGIC: POLLINATIONS.AI (OPENAI) ---
    if (modelId === ModelType.VELICIA_V5) {
        // Use the Pollinations service for Velicia v5 (OpenAI)
        // Note: Pollinations currently implies text-only support via this endpoint style
        // If attachments exist, we might need to fallback or warn, but for now we proceed with text.
        const responseText = await sendToPollinations(text, history, CONFIG.SYSTEM_INSTRUCTION);
        return {
            text: responseText,
            groundingMetadata: undefined // Pollinations doesn't provide Google grounding metadata
        };
    }

    // --- ROUTING LOGIC: GOOGLE GENAI ---
    if (!chatSession || currentModel !== modelId) {
        initializeGeminiChat(modelId);
    }

    if (!chatSession) throw new Error("Chat session not initialized");

    const currentParts: any[] = [];
    
    // Handle multiple attachments
    if (attachments && attachments.length > 0) {
        attachments.forEach(att => {
            const base64Data = att.content.split(',')[1]; 
            currentParts.push({ 
                inlineData: { 
                    mimeType: att.mimeType, 
                    data: base64Data 
                } 
            });
        });
    }

    if (text) currentParts.push({ text: text });

    let attempt = 0;
    const maxRetries = 2;

    while (attempt <= maxRetries) {
        try {
            // Fix: sendMessage message parameter must be a string or Part[].
            const response: GenerateContentResponse = await chatSession.sendMessage({ 
              message: (attachments && attachments.length > 0) ? currentParts : text 
            });
            
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
    
    // Check specific Pollinations error
    if (error.message.includes('Pollinations')) {
        return { text: `⚠️ **Koneksi Jaringan OpenAI Gagal**. ${error.message}` };
    }
    
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

export const generatePresentationImage = async (prompt: string): Promise<string> => {
    return ""; 
};
