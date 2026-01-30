
import { GoogleGenerativeAI, ChatSession, HarmCategory, HarmBlockThreshold, Part } from "@google/generative-ai";
import { Message, ModelType, GroundingMetadata, Attachment, Role } from '../types';
import { CONFIG } from '../config';
import { sendToPollinations } from './pollinationsService';

// Exported IMAGE_MODELS
export const IMAGE_MODELS = ['gemini-2.5-flash-image', 'gemini-3-pro-image-preview', 'imagen-4.0-generate-001', 'nano-banana-pro-preview'];

let chatSession: ChatSession | null = null;
let currentModelId: string | null = null;
let genAI: GoogleGenerativeAI | null = null;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const initializeGeminiChat = async (modelId: string, history: Message[], customSystemInstruction?: string) => {
  // Initialize Gen 1 Client
  if (!genAI) {
    // Vite akan me-replace process.env.API_KEY dengan string value saat build
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    
    if (!apiKey) {
        console.error("API Key is missing. Please check your .env file.");
        throw new Error("API Key tidak ditemukan.");
    }

    genAI = new GoogleGenerativeAI(apiKey);
  }
  
  let instruction = customSystemInstruction || CONFIG.SYSTEM_INSTRUCTION;

  // Configuration for specific models
  if (modelId === ModelType.VELICIA_PRO) {
    instruction = CONFIG.DEEP_REASONING_INSTRUCTION;
  }
  
  // Mapping logic (Gen 1)
  // Gen 1 SDK biasanya menggunakan nama model langsung, misal 'gemini-1.5-flash'
  // Sesuaikan mapping ini jika model ID di types.ts berbeda dengan nama model API
  const actualModelId = modelId; 
  
  // Create Model Instance (Gen 1 Style)
  const model = genAI.getGenerativeModel({
    model: actualModelId,
    systemInstruction: instruction,
    safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    ]
  });

  // Convert internal Message[] to Gen 1 SDK Content[]
  // Gen 1 expects: { role: string, parts: { text: string }[] }
  // Filter pesan terakhir karena akan dikirim via sendMessage
  const historyMessages = history.slice(0, -1);

  const sdkHistory = historyMessages.map(msg => {
      const parts: Part[] = [];
      
      // Handle Text
      if (msg.text) {
          parts.push({ text: msg.text });
      }

      // Handle Attachments (Images) di History
      // Note: Gen 1 Chat History support untuk gambar tergantung model, 
      // tapi struktur datanya harus { inlineData: ... }
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

      return {
          role: msg.role === Role.MODEL ? 'model' : 'user',
          parts: parts
      };
  });
  
  chatSession = model.startChat({
    history: sdkHistory,
    generationConfig: {
        maxOutputTokens: 8192,
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
    // --- ROUTING LOGIC: POLLINATIONS.AI ---
    const pollinationModels = [
        ModelType.VELICIA_V5, 
        ModelType.VELICIA_GPT4, 
        ModelType.VELICIA_CLAUDE, 
        ModelType.VELICIA_MISTRAL
    ];

    if (pollinationModels.includes(modelId as ModelType)) {
        const responseText = await sendToPollinations(text, history, CONFIG.SYSTEM_INSTRUCTION, modelId);
        return {
            text: responseText,
            groundingMetadata: undefined 
        };
    }

    // --- ROUTING LOGIC: GOOGLE GENERATIVE AI (GEN 1) ---
    // Always re-initialize to ensure context/model freshness
    await initializeGeminiChat(modelId, history);

    if (!chatSession) throw new Error("Chat session not initialized");

    const currentParts: Part[] = [];
    
    // Handle multiple attachments for the current message (Gen 1 Style)
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
            // Gen 1 SDK: sendMessage accepts string or Part[]
            const payload = (attachments && attachments.length > 0) ? currentParts : text;
            
            const result = await chatSession.sendMessage(payload);
            const response = await result.response;
            const responseText = response.text();
            
            // Gen 1 Metadata extraction (Type casting 'any' because strict types might miss experimental fields)
            const rawMetadata = (response.candidates?.[0] as any)?.groundingMetadata as any;
            
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
    
    if (error.message.includes('Pollinations')) {
        return { text: `⚠️ **Koneksi Eksternal Gagal**. ${error.message}` };
    }
    
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
