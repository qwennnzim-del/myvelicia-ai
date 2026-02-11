
import { GoogleGenAI, Chat, Part, Modality } from "@google/genai";
import { Message, ModelType, GroundingMetadata, Attachment, Role } from '../types';
import { CONFIG } from '../config';

// No longer exporting IMAGE_MODELS as we removed image gen focus
export const IMAGE_MODELS = []; 

const getAIClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error("API_KEY is missing in environment variables.");
        throw new Error("Fitur ini membutuhkan API_KEY di konfigurasi environment");
    }
    return new GoogleGenAI({ apiKey: apiKey });
};

// Helper to map internal App IDs to valid Google GenAI Model Names
const getGeminiModelName = (modelId: string): string => {
    switch (modelId) {
        case ModelType.GEN2_REASONING:
            return 'gemini-3-pro-preview'; 
        case ModelType.GEN2_PRO:
            return 'gemini-3-pro-preview'; 
        case ModelType.GEN2_V2_5:
        default:
            return 'gemini-3-flash-preview'; 
    }
};

// --- STREAMING IMPLEMENTATION ---
export async function* streamMessageToGemini(
  text: string, 
  modelId: string,
  history: Message[],
  attachments?: Attachment[]
): AsyncGenerator<{ text: string; groundingMetadata?: GroundingMetadata }> {
    
    const ai = getAIClient();
    
    // Prepare History
    const historyMessages = history.slice(0, -1);
    const sdkHistory = historyMessages.map(msg => {
        const parts: Part[] = [];
        if (msg.attachments) {
            msg.attachments.forEach(att => {
                parts.push({ inlineData: { mimeType: att.mimeType, data: att.content.split(',')[1] } });
            });
        }
        if (msg.text) parts.push({ text: msg.text });
        return { role: msg.role === Role.MODEL ? 'model' : 'user', parts };
    });

    const systemInstruction = modelId === ModelType.GEN2_REASONING 
        ? CONFIG.DEEP_REASONING_INSTRUCTION 
        : CONFIG.SYSTEM_INSTRUCTION;

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

    try {
        const result = await chatSession.sendMessageStream({ message: messageContent });
        
        for await (const chunk of result) {
            const chunkText = chunk.text || "";
            // We yield chunks as they come in.
            // Note: groundingMetadata usually appears in the last chunk or aggregated response
            yield { 
                text: chunkText,
                groundingMetadata: chunk.candidates?.[0]?.groundingMetadata as unknown as GroundingMetadata
            };
        }
    } catch (error: any) {
        console.error("Stream Error:", error);
        yield { text: `⚠️ Error: ${error.message}` };
    }
}

// Keep the non-streaming version for fallback or specific uses
export const sendMessageToGemini = async (
  text: string, 
  modelId: string,
  history: Message[],
  attachments?: Attachment[]
): Promise<{ text: string; groundingMetadata?: GroundingMetadata }> => {
    // Re-use the generator but consume it all at once
    let fullText = "";
    let finalMetadata;
    for await (const chunk of streamMessageToGemini(text, modelId, history, attachments)) {
        fullText += chunk.text;
        if (chunk.groundingMetadata) finalMetadata = chunk.groundingMetadata;
    }
    return { text: fullText, groundingMetadata: finalMetadata };
};

// Deprecated / Placeholder
export const generatePresentationImage = async (prompt: string): Promise<string> => {
    return ""; 
};

// --- AUDIO / TTS SERVICE ---
export const generateSpeechFromGemini = async (text: string): Promise<string | undefined> => {
    const ai = getAIClient();
    try {
        // 1. Clean Markdown heavily before sending to TTS model
        // This prevents the AI from reading symbols like "Asterisk Asterisk Title..."
        let cleanText = text
            .replace(/[*#_`~]/g, '') // Remove basic markdown symbols
            .replace(/\[.*?\]\(.*?\)/g, '') // Remove links
            .replace(/https?:\/\/\S+/g, 'link') // Replace URLs with word "link"
            .replace(/\n\n/g, '. '); // Replace double newlines with pauses
        
        // 2. Truncate for safety limits
        const safeText = cleanText.length > 800 ? cleanText.substring(0, 800) + "..." : cleanText;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts", 
            contents: [{ 
                parts: [{ 
                    text: `Read this text clearly and naturally in Indonesian language. Do not add any opening or closing remarks, just read the text: "${safeText}"` 
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
        
        const parts = response.candidates?.[0]?.content?.parts;
        if (parts) {
            for (const part of parts) {
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
