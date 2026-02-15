
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
            return 'gemini-2.5-flash'; 
        case ModelType.GEN2_PRO:
            return 'gemini-2.5-flash'; 
        case ModelType.GEN2_V2_5:
        default:
            return 'gemini-2.5-flash'; 
    }
};

// Helper: Fetch URL and convert to Base64 (Clean)
// Digunakan karena Gemini API via SDK membutuhkan inlineData (base64) 
// dan tidak bisa menerima public URL secara langsung di parameter parts.
const getBase64FromUrl = async (url: string): Promise<string> => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch image data");
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const res = reader.result as string;
                // Remove prefix like "data:image/jpeg;base64,"
                resolve(res.split(',')[1]);
            };
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        console.error("Error converting URL to Base64 for Gemini:", e);
        return "";
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
    
    // --- STRATEGI PENGHEMATAN TOKEN (CONTEXT PRUNING) ---
    // Kita ambil semua pesan kecuali yang terakhir (karena yang terakhir adalah input user saat ini)
    let historyMessages = history.slice(0, -1);

    // LIMITASI: Hanya kirim 10 pesan terakhir untuk menghemat TPM (Tokens Per Minute)
    // Semakin kecil history, semakin kecil kemungkinan terkena limit rate.
    const MAX_HISTORY_MESSAGES = 10;
    if (historyMessages.length > MAX_HISTORY_MESSAGES) {
        historyMessages = historyMessages.slice(-MAX_HISTORY_MESSAGES);
    }

    // Prepare History with Async Processing (for Image URLs)
    const sdkHistory: { role: string; parts: Part[] }[] = [];
    
    for (const msg of historyMessages) {
        const parts: Part[] = [];
        
        if (msg.attachments && msg.attachments.length > 0) {
            for (const att of msg.attachments) {
                let base64Data = "";
                
                // Jika konten adalah URL (dari Firebase Storage), fetch dulu jadi Base64
                if (att.content.startsWith('http')) {
                    base64Data = await getBase64FromUrl(att.content);
                } 
                // Jika konten adalah Base64 (lokal state), ambil langsung
                else if (att.content.startsWith('data:')) {
                    base64Data = att.content.split(',')[1];
                }

                if (base64Data) {
                    parts.push({ inlineData: { mimeType: att.mimeType, data: base64Data } });
                }
            }
        }
        
        if (msg.text) {
             // OPTIMISASI: Truncate teks history yang sangat panjang
             // Jika ada pesan > 2000 karakter di masa lalu, kita potong untuk menghemat token.
             // Model biasanya hanya butuh konteks inti, bukan keseluruhan esai lama.
             const MAX_CHAR_PER_MSG = 2000;
             let content = msg.text;
             if (content.length > MAX_CHAR_PER_MSG) {
                 content = content.substring(0, MAX_CHAR_PER_MSG) + "... (truncated for token efficiency)";
             }
             parts.push({ text: content });
        }
        
        // Push processed message to history
        sdkHistory.push({ role: msg.role === Role.MODEL ? 'model' : 'user', parts });
    }

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
            // OPTIMISASI: Batasi output token.
            // Membatasi output membantu mencegah penggunaan TPM berlebih jika model "berhalusinasi" panjang.
            // 4096 cukup untuk jawaban panjang tapi aman.
            maxOutputTokens: 4096, 
        }
    });

    // Prepare Current Message Parts
    const currentParts: Part[] = [];
    if (attachments && attachments.length > 0) {
        for (const att of attachments) {
            let base64Data = "";
            if (att.content.startsWith('http')) {
                base64Data = await getBase64FromUrl(att.content);
            } else if (att.content.startsWith('data:')) {
                base64Data = att.content.split(',')[1];
            }

            if (base64Data) {
                currentParts.push({ inlineData: { mimeType: att.mimeType, data: base64Data } });
            }
        }
    }
    if (text) currentParts.push({ text: text });

    let messageContent: any = text;
    if (currentParts.length > 0) messageContent = currentParts;

    try {
        const result = await chatSession.sendMessageStream({ message: messageContent });
        
        for await (const chunk of result) {
            const chunkText = chunk.text || "";
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
        let cleanText = text
            .replace(/[*#_`~]/g, '') 
            .replace(/\[.*?\]\(.*?\)/g, '') 
            .replace(/https?:\/\/\S+/g, 'link') 
            .replace(/\n\n/g, '. '); 
        
        const safeText = cleanText.length > 800 ? cleanText.substring(0, 800) + "..." : cleanText;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts", 
            contents: [{ 
                parts: [{ 
                    text: `Read this text clearly and naturally in Indonesian language: "${safeText}"` 
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
