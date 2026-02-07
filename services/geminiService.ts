import { GoogleGenAI, Chat, Part, Modality } from "@google/genai";
import { Message, ModelType, GroundingMetadata, Attachment, Role } from '@/types';
import { CONFIG } from '@/config';

// Exported IMAGE_MODELS
export const IMAGE_MODELS = ['gemini-2.5-flash-image', 'gemini-3-pro-image-preview', 'imagen-4.0-generate-001', 'nano-banana-pro-preview'];

// --- API KEY ROTATION SYSTEM ---
// Masukkan semua API Key cadangan Anda di sini.
// Sistem akan otomatis berpindah jika satu key habis limitnya.
const API_KEY_POOL = [
    process.env.API_KEY, // Key utama dari .env
    // "AIzaSy... (Key Cadangan 1)",
    // "AIzaSy... (Key Cadangan 2)",
    // "AIzaSy... (Key Cadangan 3)",
].filter(key => key && key.length > 10); // Filter key yang valid

let currentKeyIndex = 0;
let chatSession: Chat | null = null;
let currentModelId: string | null = null;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mendapatkan Client GoogleGenAI dengan strategi prioritas:
 * 1. Custom Key milik User (dari LocalStorage)
 * 2. Key Rotasi dari Pool (jika key user kosong)
 */
const getAIClient = () => {
    // 1. Cek apakah User punya key sendiri
    if (typeof window !== 'undefined') {
        const userKey = localStorage.getItem('velicia_user_api_key');
        if (userKey && userKey.trim().length > 10) {
            return new GoogleGenAI({ apiKey: userKey });
        }
    }

    // 2. Gunakan Key dari Pool
    if (API_KEY_POOL.length === 0) {
        throw new Error("Tidak ada API Key yang tersedia. Mohon masukkan API Key di Settings.");
    }
    
    const keyToUse = API_KEY_POOL[currentKeyIndex % API_KEY_POOL.length];
    // console.log(`Using API Key Index: ${currentKeyIndex % API_KEY_POOL.length}`); // Debugging
    return new GoogleGenAI({ apiKey: keyToUse });
};

// Fungsi untuk merotasi key jika limit habis
const rotateKey = () => {
    currentKeyIndex++;
    console.warn(`⚠️ Quota Exceeded. Rotating to API Key #${currentKeyIndex % API_KEY_POOL.length}`);
};

const initializeGeminiChat = async (modelId: string, history: Message[], customSystemInstruction?: string) => {
  const ai = getAIClient();
  
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
          // ENABLE GOOGLE SEARCH GROUNDING
          tools: [{ googleSearch: {} }],
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
  
  const maxRetries = API_KEY_POOL.length > 1 ? API_KEY_POOL.length * 2 : 2;
  let attempt = 0;

  // LOOP RETRY UNTUK ROTASI KEY
  while (attempt < maxRetries) {
    try {
        // --- BANANA PRO 3 (IMAGE EDITING/GENERATION) LOGIC ---
        if (modelId === 'gemini-3-pro-image-preview') {
            const ai = getAIClient();
            const parts: Part[] = [];

            // 1. Add Image (if editing)
            if (attachments && attachments.length > 0) {
                attachments.forEach(att => {
                    if (att.type === 'image') {
                        const base64Data = att.content.split(',')[1];
                        parts.push({
                            inlineData: {
                                mimeType: att.mimeType,
                                data: base64Data
                            }
                        });
                    }
                });
            }

            // 2. Add Prompt
            if (text) parts.push({ text: text });

            const response = await ai.models.generateContent({
                model: modelId,
                contents: { parts },
                config: {
                    systemInstruction: "You are an expert precision image editor and generator. Your core directive is OBEDIENCE and PRECISION.",
                }
            });

            let outputText = "";
            let generatedImageBase64 = null;
            let outputMetadata = undefined;

            const firstCandidate = response.candidates?.[0];
            const content = firstCandidate?.content;

            if (content?.parts) {
                for (const part of content.parts) {
                    if (part.inlineData) {
                        generatedImageBase64 = part.inlineData.data;
                    } else if (part.text) {
                        outputText += part.text;
                    }
                }
                outputMetadata = firstCandidate?.groundingMetadata as unknown as GroundingMetadata;
            }

            if (generatedImageBase64) {
                const imageMarkdown = `\n\n![Generated Image](data:image/png;base64,${generatedImageBase64})`;
                return { 
                    text: outputText ? `${outputText}${imageMarkdown}` : imageMarkdown,
                    groundingMetadata: outputMetadata
                };
            } else {
                return { 
                    text: outputText || "Maaf, gagal membuat gambar.",
                    groundingMetadata: outputMetadata
                };
            }
        }

        // --- STANDARD TEXT CHAT LOGIC ---
        // Always re-initialize to ensure context/model freshness and correct API KEY usage
        await initializeGeminiChat(modelId, history);

        if (!chatSession) throw new Error("Chat session not initialized");

        const currentParts: Part[] = [];
        
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

        let messageContent: any = text;
        if (currentParts.length > 0) {
            messageContent = currentParts;
        }

        const result = await chatSession.sendMessage({ message: messageContent });
        const responseText = result.text;
        const rawMetadata = result.candidates?.[0]?.groundingMetadata as unknown as GroundingMetadata;
        
        return { 
            text: responseText || "Maaf, tidak ada respons.",
            groundingMetadata: rawMetadata
        };

    } catch (error: any) {
        console.error(`Attempt ${attempt + 1} failed. Error:`, error.message);

        // DETEKSI ERROR QUOTA / RATE LIMIT (429)
        const isQuotaError = error.message?.includes('429') || error.status === 429 || error.message?.includes('Quota exceeded');
        
        if (isQuotaError) {
            // Jika user pakai custom key, jangan rotasi pool, tapi beri tahu user
            const userKey = localStorage.getItem('velicia_user_api_key');
            if (userKey) {
                return { text: "⚠️ **Kuota Custom Key Anda Habis.** Mohon periksa limit API Key Anda di Google AI Studio atau hapus custom key di Settings untuk menggunakan kuota gratis Velicia." };
            }

            // Jika pakai Pool, lakukan Rotasi
            rotateKey();
            attempt++;
            await delay(1000); // Tunggu sebentar sebelum switch
            continue; // Ulangi loop dengan key baru
        }

        // Handle Permission Denied / Key Selection
        if (error.message?.includes("Requested entity was not found") || error.message?.includes("PERMISSION_DENIED") || error.status === 403) {
             const win = window as any;
             if (win.aistudio) {
                 try {
                     await win.aistudio.openSelectKey();
                     return { text: "⚠️ **Akses Ditolak**. Dialog pemilihan kunci API dibuka." };
                 } catch (selectError) {
                     console.error("Error opening key selector:", selectError);
                 }
             }
             return { text: "⚠️ **Akses Ditolak**. Kunci API tidak valid." };
        }
        
        throw error; // Lempar error lain
    }
  }

  throw new Error("Layanan sedang sibuk. Silakan coba lagi nanti.");
};

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

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        return base64Audio;
    } catch (error) {
        console.error("TTS Generation Error:", error);
        throw error;
    }
};