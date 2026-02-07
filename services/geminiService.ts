
import { GoogleGenAI, Chat, Part, Modality } from "@google/genai";
import { Message, ModelType, GroundingMetadata, Attachment, Role } from '@/types';
import { CONFIG } from '@/config';

// Exported IMAGE_MODELS
export const IMAGE_MODELS = ['gemini-2.5-flash-image', 'gemini-3-pro-image-preview', 'imagen-4.0-generate-001', 'nano-banana-pro-preview'];

let chatSession: Chat | null = null;
let currentModelId: string | null = null;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getAIClient = () => {
    if (!process.env.API_KEY) {
        console.error("API Key is missing.");
        throw new Error("API Key tidak ditemukan.");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
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
  try {
    // --- BANANA PRO 3 (IMAGE EDITING/GENERATION) LOGIC ---
    if (modelId === ModelType.BANANA_PRO_3) {
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

        // 3. Call GenerateContent (Stateless for precise config)
        // Using 'gemini-2.5-flash-image' via ModelType.BANANA_PRO_3
        const response = await ai.models.generateContent({
            model: modelId,
            contents: { parts },
            config: {
                // STRICT System Instruction for Precision
                systemInstruction: "You are an expert precision image editor and generator. Your core directive is OBEDIENCE and PRECISION. When editing: Change ONLY what the user explicitly commands. Do NOT alter the original design style, composition, lighting, or details unless instructed. Maintain high fidelity to the source image. When generating: Create high-quality images that exactly match the prompt.",
                // Flash models don't support responseMimeType/responseSchema for images
            }
        });

        // 4. Parse Response for Image
        let outputText = "";
        let generatedImageBase64 = null;
        let outputMetadata = undefined;

        if (response.candidates && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    generatedImageBase64 = part.inlineData.data;
                } else if (part.text) {
                    outputText += part.text;
                }
            }
            outputMetadata = response.candidates[0].groundingMetadata as unknown as GroundingMetadata;
        }

        // 5. Construct Result
        if (generatedImageBase64) {
             const imageMarkdown = `\n\n![Generated Image](data:image/png;base64,${generatedImageBase64})`;
             // If there's text explanation, put it before image, otherwise just image
             return { 
                 text: outputText ? `${outputText}${imageMarkdown}` : imageMarkdown,
                 groundingMetadata: outputMetadata
             };
        } else {
             return { 
                 text: outputText || "Maaf, gagal membuat gambar. Mohon coba lagi dengan deskripsi yang lebih spesifik.",
                 groundingMetadata: outputMetadata
             };
        }
    }

    // --- STANDARD TEXT CHAT LOGIC ---
    
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

    // Handle Permission Denied / Key Selection
    if (error.message?.includes("Requested entity was not found") || error.message?.includes("PERMISSION_DENIED") || error.status === 403) {
         const win = window as any;
         if (win.aistudio) {
             try {
                 await win.aistudio.openSelectKey();
                 return { text: "⚠️ **Akses Ditolak**. Kami telah membuka dialog pemilihan kunci API. Silakan pilih kunci yang valid dan coba lagi." };
             } catch (selectError) {
                 console.error("Error opening key selector:", selectError);
             }
         }
         return { text: "⚠️ **Akses Ditolak**. Model ini memerlukan API Key yang valid. Pastikan Anda memiliki izin akses." };
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

/**
 * Generates speech from text using Gemini 2.5 Flash TTS.
 * Returns raw PCM Base64 string.
 */
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
                        prebuiltVoiceConfig: { voiceName: 'Kore' }, // 'Kore' voice
                    },
                },
            },
        });

        // Extract Base64 audio data
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        return base64Audio;
    } catch (error) {
        console.error("TTS Generation Error:", error);
        throw error;
    }
};
