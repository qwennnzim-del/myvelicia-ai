import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import { Message, Role, Attachment, GroundingMetadata, ModelType } from '../types';
import { CONFIG } from '../config';

let chatSession: Chat | null = null;
let currentModel: string | null = null;

export const IMAGE_MODELS = [
    'flux', 'midjourney', 'gptimage', 'gptimage-large', ModelType.IMAGE_FLASH
];

interface AIResponse {
  text: string;
  groundingMetadata?: GroundingMetadata;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const initializeChat = (modelId: string) => {
  if (!modelId.startsWith('gemini-')) {
    currentModel = modelId;
    chatSession = null;
    return;
  }
  
  // Use process.env.API_KEY as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  chatSession = ai.chats.create({
    model: modelId,
    config: {
      systemInstruction: CONFIG.SYSTEM_INSTRUCTION,
      tools: [{ googleSearch: {} }],
    },
  });
  currentModel = modelId;
};

// ... (existing helper functions) ...
const generateImagePollinations = async (prompt: string, modelId: string): Promise<string> => {
    const seed = Math.floor(Math.random() * 10000000);
    const encodedPrompt = encodeURIComponent(prompt);
    let targetModel = 'flux';
    if (modelId === 'midjourney') targetModel = 'midjourney';
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=720&seed=${seed}&nologo=true&model=${targetModel}`;
    
    return imageUrl;
};

export const generatePresentationImage = async (prompt: string): Promise<string> => {
    return await generateImagePollinations(prompt, 'flux');
};

const analyzeImageWithGemini = async (attachment: Attachment): Promise<string> => {
  // Use process.env.API_KEY as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const base64Data = attachment.content.split(',')[1];
  try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          parts: [
            { inlineData: { mimeType: attachment.mimeType, data: base64Data } },
            { text: "Describe this image in detail. Focus on the main elements, text, and context." }
          ]
        }
      });
      return response.text || "Image analysis unavailable.";
  } catch (error) {
      console.error("Analysis Error:", error);
      return "Image analysis failed.";
  }
};

const sendMessageToPollinations = async (text: string, history: Message[], modelId: string, attachment?: Attachment): Promise<string> => {
  try {
    const apiModelId = CONFIG.POLLINATIONS.MODEL_MAPPING[modelId] || modelId;
    
    const messages = [
      { role: "system", content: CONFIG.SYSTEM_INSTRUCTION },
      ...history.map(msg => ({ role: msg.role === Role.MODEL ? "assistant" : "user", content: msg.text || " " })),
      { role: "user", content: attachment ? [{ type: "text", text: text || "Analyze this." }, { type: "image_url", image_url: { url: attachment.content } }] : text }
    ];

    const response = await fetch(CONFIG.POLLINATIONS.API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
              model: apiModelId, 
              messages: messages, 
              json: false, 
              seed: Math.floor(Math.random() * 1000) 
          })
    });

    if (!response.ok) {
        throw new Error(`External Provider Error (${response.status})`);
    }
    
    const result = await response.text();
    return result || "No response.";
  } catch (error: any) {
    console.warn(`Pollinations API Error: ${error.message}`);
    return `⚠️ Maaf, model eksternal (${modelId}) sedang tidak tersedia atau mengalami gangguan. Silakan coba model 'Velicia AI' atau 'Gemini'.`;
  }
};

export const sendMessageToGemini = async (
  text: string, 
  modelId: string,
  history: Message[],
  attachment?: Attachment
): Promise<AIResponse> => {
  try {
    // 1. Image Generation Models
    if (modelId === ModelType.IMAGE_FLASH) {
        // Use process.env.API_KEY as per guidelines
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
            model: modelId,
            contents: { parts: [{ text: text }] },
        });
        let imageUrl = '';
        if (response.candidates?.[0]?.content?.parts) {
             for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                    break;
                }
             }
        }
        if (!imageUrl) throw new Error("No image generated.");
        return { text: `![Generated Image](${imageUrl})` };
    }

    if (IMAGE_MODELS.includes(modelId) || modelId.startsWith('flux')) {
        const imageUrl = await generateImagePollinations(text, modelId);
        return { text: `![Generated Image](${imageUrl})` };
    }

    // 2. External Text Models (Pollinations)
    if (!modelId.startsWith('gemini-')) {
      let finalMessage = text;
      if (attachment) {
          try {
             const imageAnalysis = await analyzeImageWithGemini(attachment);
             finalMessage = text ? `${text}\n\n[Analysis: ${imageAnalysis}]` : `[User uploaded image. Analysis: ${imageAnalysis}] Explain this.`;
             attachment = undefined;
          } catch (e) { console.warn(e); }
      }
      const responseText = await sendMessageToPollinations(finalMessage, history, modelId, attachment);
      return { text: responseText };
    }

    // 3. Google Gemini Models (with Retry Logic)
    const currentParts: any[] = [];
    if (attachment) {
      const base64Data = attachment.content.split(',')[1]; 
      currentParts.push({ inlineData: { mimeType: attachment.mimeType, data: base64Data } });
    }
    if (text) currentParts.push({ text: text });
    
    // Initialize session if needed
    if (!chatSession || currentModel !== modelId) initializeChat(modelId);
    if (!chatSession) throw new Error("Failed to initialize chat");

    // Retry Loop for 429 Errors
    let attempt = 0;
    const maxRetries = 3;
    let lastError: any;

    while (attempt < maxRetries) {
        try {
            const response: GenerateContentResponse = await chatSession.sendMessage({ message: attachment ? currentParts : text });
            return { 
                text: response.text || "Maaf, tidak ada respons.",
                groundingMetadata: response.candidates?.[0]?.groundingMetadata as GroundingMetadata
            };
        } catch (error: any) {
            lastError = error;
            // Check for Quota Exceeded (429) or Service Unavailable (503)
            if (error.message?.includes('429') || error.status === 429 || error.message?.includes('Quota exceeded')) {
                console.warn(`Attempt ${attempt + 1} failed with 429. Retrying...`);
                attempt++;
                if (attempt < maxRetries) {
                    await delay(2000 * attempt); // Exponential backoff: 2s, 4s
                    continue;
                }
            }
            break;
        }
    }
    
    throw lastError;

  } catch (error: any) {
    console.error("API Error:", error);
    
    // Handle Permission/Auth Errors
    if (error.message?.includes('403') || error.status === 'PERMISSION_DENIED') {
         if (typeof window !== 'undefined' && (window as any).aistudio) {
             try { await (window as any).aistudio.openSelectKey(); } catch (e) {}
             return { text: "⚠️ **Akses Ditolak**. Silakan pilih API Key yang valid." };
         }
    }

    // Handle Quota Errors explicitly
    if (error.message?.includes('429') || error.message?.includes('Quota exceeded')) {
        return { text: "⚠️ **Kuota Habis (Limit Tercapai)**. \n\nMohon tunggu beberapa saat sebelum mengirim pesan lagi, atau coba ganti ke model lain seperti 'Gemini 2.0 Flash' atau 'Gemini Pro'." };
    }

    return { text: `Error: ${error.message || "Terjadi kesalahan internal."}` };
  }
};
