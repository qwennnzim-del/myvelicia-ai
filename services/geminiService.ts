
import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import { Message, Role, Attachment, GroundingMetadata, ModelType } from '../types';
import { CONFIG } from '../config';

let chatSession: Chat | null = null;
let currentModel: string | null = null;

export const IMAGE_MODELS = [
    'flux', 'midjourney', 'gptimage', 'gptimage-large', ModelType.IMAGE_FLASH, ModelType.IMAGE_PRO
];

interface AIResponse {
  text: string;
  groundingMetadata?: GroundingMetadata;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to initialize chat with specific system instructions
const initializeGeminiChat = (modelId: string, customSystemInstruction?: string) => {
  // Use process.env.API_KEY as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Always use a stable Gemini model for the session, even if mocking another model
  // Updated default fallback to Gemini 3 Flash
  const actualModel = modelId.startsWith('gemini-') ? modelId : 'gemini-3-flash-preview';

  chatSession = ai.chats.create({
    model: actualModel,
    config: {
      systemInstruction: customSystemInstruction || CONFIG.SYSTEM_INSTRUCTION,
      tools: [{ googleSearch: {} }],
    },
  });
  currentModel = modelId; // We track the 'logical' model, not necessarily the underlying one
};

const generateImagePollinations = async (prompt: string, modelId: string): Promise<string> => {
    const seed = Math.floor(Math.random() * 10000000);
    const encodedPrompt = encodeURIComponent(prompt);
    let targetModel = 'flux'; // Default stable model
    
    if (modelId === 'midjourney') targetModel = 'midjourney';
    if (modelId === 'gptimage-large') targetModel = 'dall-e-3';

    // Using a more reliable endpoint construction
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&nologo=true&model=${targetModel}`;
    
    // Validate image availability (optional, but good for UX)
    return imageUrl;
};

export const generatePresentationImage = async (prompt: string): Promise<string> => {
    return await generateImagePollinations(prompt, 'flux');
};

const analyzeImageWithGemini = async (attachment: Attachment): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const base64Data = attachment.content.split(',')[1];
  try {
      // Use Gemini 3 Flash for fast image analysis
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
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
    const apiModelId = CONFIG.POLLINATIONS.MODEL_MAPPING[modelId] || 'openai'; // Fallback to 'openai' which is generic
    
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
    if (!result) throw new Error("Empty response from external provider");
    return result;
};

export const sendMessageToGemini = async (
  text: string, 
  modelId: string,
  history: Message[],
  attachment?: Attachment
): Promise<AIResponse> => {
  try {
    // --- 1. HANDLE IMAGE GENERATION MODELS ---
    
    // A. Gemini Native Image Gen (Nano/Pro Vision)
    if (modelId === ModelType.IMAGE_FLASH || modelId === ModelType.IMAGE_PRO) {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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

    // B. External Image Gen (Flux, Midjourney, etc.)
    if (IMAGE_MODELS.includes(modelId) || modelId.startsWith('flux')) {
        const imageUrl = await generateImagePollinations(text, modelId);
        // Return immediately with Markdown image
        return { text: `![Generated Image](${imageUrl})` };
    }


    // --- 2. HANDLE TEXT MODELS (External & Native) ---
    
    let responseText = "";
    let groundingMetadata: GroundingMetadata | undefined;

    // Check if it's an external text model (GPT, DeepSeek)
    if (!modelId.startsWith('gemini-')) {
        let finalMessage = text;
        
        // Handle image attachments for external models by analyzing them first
        if (attachment) {
            try {
               const imageAnalysis = await analyzeImageWithGemini(attachment);
               finalMessage = text ? `${text}\n\n[System Note: User uploaded an image. Image Analysis: ${imageAnalysis}]` : `[System Note: User uploaded an image. Image Analysis: ${imageAnalysis}] Explain this.`;
            } catch (e) { console.warn(e); }
        }

        try {
            // Try the external provider first
            responseText = await sendMessageToPollinations(finalMessage, history, modelId);
            return { text: responseText };
        } catch (error) {
            console.warn(`External model ${modelId} failed. Falling back to Gemini 3 Flash acting as ${modelId}.`, error);
            
            // FALLBACK LOGIC: Fallback to Gemini 3 Flash
            const personaPrompt = `You are strictly acting as the AI model '${modelId}'. Use the tone, style, and reasoning capabilities typical of this model. Do not mention you are Gemini unless asked about your underlying architecture. ${CONFIG.SYSTEM_INSTRUCTION}`;
            initializeGeminiChat('gemini-3-flash-preview', personaPrompt);
            
            text = finalMessage; 
            attachment = undefined; 
        }
    } else {
        // Normal Gemini Initialization
        if (!chatSession || currentModel !== modelId) {
             initializeGeminiChat(modelId);
        }
    }

    // --- 3. EXECUTE GEMINI (Native or Fallback) ---
    if (!chatSession) throw new Error("Chat session not initialized");

    const currentParts: any[] = [];
    if (attachment) {
      const base64Data = attachment.content.split(',')[1]; 
      currentParts.push({ inlineData: { mimeType: attachment.mimeType, data: base64Data } });
    }
    if (text) currentParts.push({ text: text });

    // Retry Loop for Gemini API
    let attempt = 0;
    const maxRetries = 2;

    while (attempt <= maxRetries) {
        try {
            const response: GenerateContentResponse = await chatSession.sendMessage({ message: attachment ? currentParts : text });
            
            return { 
                text: response.text || "Maaf, tidak ada respons.",
                groundingMetadata: response.candidates?.[0]?.groundingMetadata as GroundingMetadata
            };
        } catch (error: any) {
            // Handle 503/429 specifically
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
    
    // Auth Error
    if (error.message?.includes('403') || error.status === 'PERMISSION_DENIED') {
         if (typeof window !== 'undefined' && (window as any).aistudio) {
             try { await (window as any).aistudio.openSelectKey(); } catch (e) {}
             return { text: "⚠️ **Akses Ditolak**. Silakan pilih API Key yang valid." };
         }
    }

    // Quota Error
    if (error.message?.includes('429') || error.message?.includes('Quota exceeded')) {
        return { text: "⚠️ **Kuota Habis**. Mohon tunggu sebentar." };
    }

    return { text: `⚠️ Maaf, terjadi kesalahan saat memproses permintaan. (${error.message})` };
  }
};
