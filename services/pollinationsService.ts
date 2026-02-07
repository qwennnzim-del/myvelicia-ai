
import { Message, Role, Attachment } from '@/types';

export const sendToPollinations = async (
  text: string,
  history: Message[],
  systemInstruction: string,
  modelId: string = 'openai',
  apiKey?: string, // Secret Key from Pollinations
  attachments?: Attachment[]
): Promise<string> => {
  try {
    // 1. Prepare Messages
    const messages: any[] = [];

    // Add System Instruction
    messages.push({ role: 'system', content: systemInstruction });

    // Format History
    // Limit context to prevent token overflow
    const cleanHistory = history.filter(msg => msg.text && !msg.text.startsWith('⚠️')).slice(-15);

    for (const msg of cleanHistory) {
        const role = msg.role === Role.MODEL ? 'assistant' : 'user';
        
        // Handle Vision/Images if available (GPT-4o supports this)
        if (msg.role === Role.USER && msg.attachments && msg.attachments.length > 0) {
            const content: any[] = [{ type: 'text', text: msg.text }];
            
            msg.attachments.forEach(att => {
                if (att.type === 'image') {
                    content.push({
                        type: 'image_url',
                        image_url: {
                            url: att.content // Base64
                        }
                    });
                }
            });
            messages.push({ role, content });
        } else {
            messages.push({ role, content: msg.text });
        }
    }

    // 2. Configure Endpoint & Headers
    // UPDATE: Menggunakan endpoint yang lebih stabil untuk Browser/CORS
    // Pilihan 1 (Standard Proxy): https://text.pollinations.ai/openai
    // Pilihan 2 (User Discovery): https://gen.pollinations.ai/v1/chat/completions
    // Kita gunakan https://text.pollinations.ai/openai karena lebih ramah CORS untuk web app.
    
    const endpoint = 'https://text.pollinations.ai/openai';
    
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (apiKey) {
        // Pass the Pollinations Secret (Bearer Token)
        headers['Authorization'] = `Bearer ${apiKey}`;
    }

    // 3. Random Seed for variety
    const seed = Math.floor(Math.random() * 1000000);

    // 4. Call API
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        messages: messages,
        model: modelId, // 'openai' maps to GPT-4o in Pollinations
        seed: seed,
        temperature: 0.7,
        max_tokens: 4096
      }),
    });

    if (!response.ok) {
      let errorDetails = response.statusText;
      try {
          const errJson = await response.json();
          errorDetails = JSON.stringify(errJson);
      } catch (e) { 
        try { errorDetails = await response.text(); } catch(z) {} 
      }
      
      if (response.status === 401 || response.status === 403) {
          throw new Error("Secret Key Pollinations tidak valid atau kedaluwarsa.");
      }
      
      throw new Error(`Server Error (${response.status}): ${errorDetails}`);
    }

    const data = await response.json();
    
    // Extract content (Pollinations /openai endpoint returns OpenAI format)
    const responseText = data.choices?.[0]?.message?.content;
    
    if (!responseText) {
        // Fallback check if response format is direct text (rare for /openai endpoint but possible)
        if (typeof data === 'string') return data;
        throw new Error("Respons kosong dari server AI.");
    }

    return responseText;

  } catch (error: any) {
    console.error("Pollinations Service Error:", error);
    
    // Error 'Failed to fetch' biasanya masalah CORS atau URL salah
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
         throw new Error("Gagal terhubung ke Server Pollinations (CORS/Network). Pastikan URL Endpoint benar.");
    }

    throw new Error(error.message || "Gagal terhubung ke layanan Pollinations.");
  }
};
