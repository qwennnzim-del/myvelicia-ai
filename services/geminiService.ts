
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
// UPDATED: Using Gemini 2.0 Flash family which is Free Tier compatible and supports Vision/Files
const getGeminiModelName = (modelId: string): string => {
    switch (modelId) {
        case ModelType.GEN2_REASONING:
            // Gen2 Deep -> Menggunakan Gemini 2.0 Flash (Smartest on Free Tier)
            // Model ini cerdas, cepat, dan mendukung reasoning + file reading
            return 'gemini-2.0-flash'; 

        case ModelType.GEN2_PRO:
            // Gen2 Docs -> Menggunakan Gemini 2.0 Flash (High Context)
            // Sangat bagus untuk membaca PDF/Excel panjang
            return 'gemini-2.0-flash'; 

        case ModelType.GEN2_V2_5:
        default:
            // Gen2 Flash -> Menggunakan Gemini 2.0 Flash Lite (Fastest)
            // Model paling ringan dan cepat untuk chat kilat
            return 'gemini-2.0-flash-lite-preview-02-05'; 
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
    // Updated to prioritize Native API using Gemini 2.0 Flash family
    // This supports Files, Images, and Search on the Free Tier.
    
    return await sendMessageToGeminiNative(text, modelId, history, attachments);

  } catch (error: any) {
    console.warn("Native Gemini failed, attempting fallback to Pollinations...", error);

    // PRIORITY 2: Pollinations Fallback
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
        return { text: "⚠️ **Model Error**. Model sedang sibuk atau tidak ditemukan. Coba pilih model 'Gen2 Flash'." };
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
        // Truncate text if too long to prevent timeouts (Gemini audio limit)
        const safeText = text.length > 800 ? text.substring(0, 800) + "..." : text;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash", 
            contents: [{ 
                parts: [{ 
                    text: `Baca teks berikut dengan suara yang jelas, natural, dan intonasi yang pas dalam Bahasa Indonesia. Jangan menambahkan komentar lain, hanya baca teks ini: "${safeText}"` 
                }] 
            }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' }, 
                    },
                },
            },
        });
        
        // Ensure we get the audio part
        const parts = response.candidates?.[0]?.content?.parts;
        if (parts) {
            for (const part of parts) {
                // Fixed optional chaining for strict null checks
                if (part.inlineData && part.inlineData.mimeType?.startsWith('audio')) {
                    return part.inlineData.data;
                }
            }
        }
        return undefined;
    } catch (error) {
        console.error("TTS Generation Error:", error);
        throw error;
    }
};
