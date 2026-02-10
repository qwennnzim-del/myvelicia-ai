
import { GoogleGenAI, Chat, Part, Modality } from "@google/genai";
import { Message, ModelType, GroundingMetadata, Attachment, Role } from '../types';
import { CONFIG } from '../config';
import { sendToPollinations } from './pollinationsService';

// No longer exporting IMAGE_MODELS as we removed image gen focus
export const IMAGE_MODELS = []; 

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getAIClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("GEMINI_API_KEY is missing in environment variables.");
        throw new Error("Fitur ini membutuhkan GEMINI_API_KEY di file .env");
    }
    return new GoogleGenAI({ apiKey: apiKey });
};

// Helper to map internal App IDs to valid Google GenAI Model Names
const getGeminiModelName = (modelId: string): string => {
    switch (modelId) {
        case ModelType.GEN2_REASONING:
            return 'gemini-3-pro-preview'; // Deep Reasoning + Search
        case ModelType.GEN2_PRO:
            return 'gemini-3-pro-preview'; // Docs/Complex + Search
        case ModelType.GEN2_V2_5:
        default:
            return 'gemini-3-flash-preview'; // Fast + Google Search Optimized
    }
};

// --- NATIVE GEMINI IMPLEMENTATION (FOR FILES/VISION/ANALYSIS & GOOGLE SEARCH) ---
const sendMessageToGeminiNative = async (
  text: string, 
  modelId: string,
  history: Message[],
  attachments?: Attachment[]
): Promise<{ text: string; groundingMetadata?: GroundingMetadata }> => {
    
    const ai = getAIClient();
    
    // Prepare History (Clean up for SDK)
    const historyMessages = history.slice(0, -1);
    const sdkHistory = historyMessages.map(msg => {
        const parts: Part[] = [];
        if (msg.attachments) {
            msg.attachments.forEach(att => {
                // Ensure correct inlineData format
                parts.push({ inlineData: { mimeType: att.mimeType, data: att.content.split(',')[1] } });
            });
        }
        if (msg.text) parts.push({ text: msg.text });
        return { role: msg.role === Role.MODEL ? 'model' : 'user', parts };
    });

    // Select System Instruction based on Model Type
    const systemInstruction = modelId === ModelType.GEN2_REASONING 
        ? CONFIG.DEEP_REASONING_INSTRUCTION 
        : CONFIG.SYSTEM_INSTRUCTION;

    // Enable Google Search Tool
    // This allows the model to decide when to browse the web for real-time info
    const tools = [{ googleSearch: {} }];

    const chatSession = ai.chats.create({
        model: getGeminiModelName(modelId),
        history: sdkHistory,
        config: {
            systemInstruction: systemInstruction,
            tools: tools, 
        }
    });

    // Prepare Current Message
    const currentParts: Part[] = [];
    if (attachments && attachments.length > 0) {
        attachments.forEach(att => {
            currentParts.push({ inlineData: { mimeType: att.mimeType, data: att.content.split(',')[1] } });
        });
    }
    if (text) currentParts.push({ text: text });

    let messageContent: any = text;
    if (currentParts.length > 0) messageContent = currentParts;

    const result = await chatSession.sendMessage({ message: messageContent });
    
    return { 
        text: result.text || "No response",
        // Extract grounding metadata to display sources in UI
        groundingMetadata: result.candidates?.[0]?.groundingMetadata as unknown as GroundingMetadata
    };
};


// --- MAIN EXPORTED FUNCTION (ROUTER) ---
export const sendMessageToGemini = async (
  text: string, 
  modelId: string,
  history: Message[],
  attachments?: Attachment[]
): Promise<{ text: string; groundingMetadata?: GroundingMetadata }> => {
  try {
    
    // PRIORITY 1: Native Gemini (Gen2 Models)
    // We prioritize Native API for all Gen2 models (Deep, Flash, Docs) to ensure:
    // 1. Google Search Grounding works (Pollinations doesn't support this)
    // 2. File attachments work
    // 3. System Instructions (Deep Thinking) work accurately
    
    // Only fall back to Pollinations if strictly necessary or for legacy models (not used currently)
    return await sendMessageToGeminiNative(text, modelId, history, attachments);

  } catch (error: any) {
    console.warn("Native Gemini failed, attempting fallback to Pollinations...", error);

    // PRIORITY 2: Pollinations Fallback
    // Only used if Native API fails (e.g. Quota exceeded or 500 error)
    // Note: Search & Files won't work perfectly here.
    try {
        if (!attachments || attachments.length === 0) {
            const responseText = await sendToPollinations(text, history, CONFIG.SYSTEM_INSTRUCTION, modelId);
            return { text: responseText };
        }
    } catch (pollinationsError) {
        console.error("All services failed.");
    }

    // Error Handling
    if (error.message?.includes("PERMISSION_DENIED") || error.status === 403) {
         return { text: "⚠️ **Akses Ditolak**. API Key tidak valid. Pastikan Anda menggunakan API Key Google AI Studio yang benar." };
    }
    if (error.message?.includes("404") || error.status === 404) {
        return { text: "⚠️ **Model Error**. Model sedang sibuk. Coba refresh atau pilih model 'Gen2 Flash'." };
    }
    return { text: `⚠️ Maaf, terjadi kesalahan pada koneksi AI: ${error.message}` };
  }
};

// Deprecated / Placeholder
export const generatePresentationImage = async (prompt: string): Promise<string> => {
    return ""; 
};

export const generateSpeechFromGemini = async (text: string): Promise<string | undefined> => {
    const ai = getAIClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' }, 
                    },
                },
            },
        });
        return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    } catch (error) {
        console.error("TTS Generation Error:", error);
        throw error;
    }
};
