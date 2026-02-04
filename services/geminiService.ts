
import { GoogleGenAI, Chat, Part } from "@google/genai";
import { Message, ModelType, GroundingMetadata, Attachment, Role } from '../types';
import { CONFIG } from '../config';

// Exported IMAGE_MODELS
export const IMAGE_MODELS = ['gemini-2.5-flash-image', 'gemini-3-pro-image-preview', 'imagen-4.0-generate-001', 'nano-banana-pro-preview'];

let chatSession: Chat | null = null;
let currentModelId: string | null = null;
let ai: GoogleGenAI | null = null;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const initializeGeminiChat = async (modelId: string, history: Message[], customSystemInstruction?: string) => {
  // Initialize GenAI Client
  if (!ai) {
    // Sesuai guideline: API Key harus diambil eksklusif dari process.env.API_KEY
    if (!process.env.API_KEY) {
        console.error("API Key is missing.");
        throw new Error("API Key tidak ditemukan.");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  
  const instruction = customSystemInstruction || CONFIG.SYSTEM_INSTRUCTION;

  // Convert internal Message[] to SDK History format
  // Filter pesan terakhir karena akan dikirim via sendMessage
  const historyMessages = history.slice(0, -1);

  const sdkHistory = historyMessages.map(msg => {
      const parts: Part[] = [];
      
      // Handle Attachments (Images) di History
      if (msg.attachments && msg.attachments.length > 0) {
          msg.attachments.forEach(att => {
              const base64Data = att.content.split(',')[1];
              parts.push({
                  inlineData: {
                      mimeType: att.mimeType,
                      data: base64Data
                  }
              });
          });
      }

      // Handle Text
      if (msg.text) {
          parts.push({ text: msg.text });
      }

      return {
          role: msg.role === Role.MODEL ? 'model' : 'user',
          parts: parts
      };
  });
  
  // Create Chat Instance
  chatSession = ai.chats.create({
    model: modelId,
    history: sdkHistory,
    config: {
        systemInstruction: instruction,
    }
  });
  
  currentModelId = modelId;
};

export const sendMessageToGemini = async (
  text: string, 
  modelId: string,
  history: Message[],
  attachments?: Attachment[]
): Promise<{ text: string; groundingMetadata?: GroundingMetadata }> => {
  try {
    // --- ROUTING LOGIC: GOOGLE GENERATIVE AI (GEN 2) ---
    // Always re-initialize to ensure context/model freshness
    await initializeGeminiChat(modelId, history);

    if (!chatSession) throw new Error("Chat session not initialized");

    const currentParts: Part[] = [];
    
    // Handle multiple attachments for the current message
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
            // New SDK: chat.sendMessage takes { message: ... }
            // message can be string, Part[], or object with parts.
            // If using attachments, pass the parts array as the message.
            let messageContent: any = text;
            
            if (currentParts.length > 0) {
                messageContent = currentParts;
            }

            const result = await chatSession.sendMessage({ message: messageContent });
            
            // result is GenerateContentResponse. Use .text property (not function).
            const responseText = result.text;
            
            // Metadata extraction
            const rawMetadata = result.candidates?.[0]?.groundingMetadata as unknown as GroundingMetadata;
            
            return { 
                text: responseText || "Maaf, tidak ada respons.",
                groundingMetadata: rawMetadata
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
    
    if (error.message?.includes('403') || error.message?.includes('PERMISSION_DENIED')) {
        return { text: "⚠️ **Akses Ditolak**. Pastikan API Key Anda valid." };
    }

    if (error.message?.includes('429') || error.message?.includes('Quota exceeded')) {
        return { text: "⚠️ **Kuota Habis**. Mohon tunggu sebentar." };
    }

    return { text: `⚠️ Maaf, terjadi kesalahan: ${error.message}` };
  }
};

export const generatePresentationImage = async (prompt: string): Promise<string> => {
    return ""; 
};
