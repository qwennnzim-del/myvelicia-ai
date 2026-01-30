
import { GoogleGenerativeAI, ChatSession, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { Message, ModelType, GroundingMetadata, Attachment } from '../types';
import { CONFIG } from '../config';
import { sendToPollinations } from './pollinationsService';

// Exported IMAGE_MODELS to fix the missing member error in MessageList.tsx
export const IMAGE_MODELS = ['gemini-2.5-flash-image', 'gemini-3-pro-image-preview', 'imagen-4.0-generate-001', 'nano-banana-pro-preview'];

let chatSession: ChatSession | null = null;
let currentModel: string | null = null;
let genAI: GoogleGenerativeAI | null = null;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const initializeGeminiChat = async (modelId: string, history: Message[], customSystemInstruction?: string) => {
  // Initialize Gen 1 Client
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.API_KEY);
  }
  
  let instruction = customSystemInstruction || CONFIG.SYSTEM_INSTRUCTION;

  // Configuration for specific models
  if (modelId === ModelType.VELICIA_PRO) {
    instruction = CONFIG.DEEP_REASONING_INSTRUCTION;
  }
  
  // Mapping logic
  const actualModelId = (modelId === ModelType.VELICIA_V5) ? 'gemini-2.0-flash' : modelId;
  
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
  const sdkHistory = history.map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.text }] // For history, we simplify to text to ensure compatibility
  }));
  
  chatSession = model.startChat({
    history: sdkHistory,
    generationConfig: {
        maxOutputTokens: 8192,
    }
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
    
    // =========================================================================
    // 1. VERCEL BACKEND INTEGRATION (PRIORITY)
    // =========================================================================
    // Jika VITE_BACKEND_URL diatur di .env, kirim request ke backend.
    if (process.env.VITE_BACKEND_URL) {
        try {
            const payload = {
                model: modelId,
                messages: history.map(msg => ({
                    role: msg.role === 'model' ? 'assistant' : 'user',
                    content: msg.text
                })).concat([{ role: 'user', content: text }]),
                systemInstruction: CONFIG.SYSTEM_INSTRUCTION,
                attachments: attachments
            };

            const response = await fetch(process.env.VITE_BACKEND_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Backend Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return { 
                text: data.text || data.content || data.message || "No response text",
                groundingMetadata: data.groundingMetadata
            };

        } catch (backendError: any) {
            console.error("Backend Vercel Error:", backendError);
            return { text: `⚠️ **Gagal menghubungi Backend**. Pastikan server Vercel aktif. (${backendError.message})` };
        }
    }

    // =========================================================================
    // 2. CLIENT-SIDE FALLBACK (SDK GEN 1)
    // =========================================================================

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
    // Always re-initialize or check if we need to switch model/context
    await initializeGeminiChat(modelId, history);

    if (!chatSession) throw new Error("Chat session not initialized");

    const currentParts: any[] = [];
    
    // Handle multiple attachments (Gen 1 Style)
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
            const result = await chatSession.sendMessage((attachments && attachments.length > 0) ? currentParts : text);
            const response = await result.response;
            const responseText = response.text();
            
            // Gen 1 Metadata extraction (candidates[0].citationMetadata / groundingMetadata usually)
            // We map it to our internal type loosely
            const rawMetadata = response.candidates?.[0]?.groundingMetadata as any;
            
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
