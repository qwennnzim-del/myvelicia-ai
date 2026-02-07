
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
    // Pollinations with Secret supports OpenAI format (which handles images too for GPT-4o)
    
    const messages: any[] = [];

    // Add System Instruction
    messages.push({ role: 'system', content: systemInstruction });

    // Format History
    // Limit context to prevent token overflow, generally safe with premium models to send more
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

    // Add current message if not in history yet (depending on how App.tsx handles it)
    // Assuming App.tsx passes history INCLUDING the new user message, we are good.
    // But if sending 'text' separately, we might need to verify logic. 
    // Usually App.tsx adds user message to history state before calling this.

    // 2. Configure Endpoint & Headers
    // If user has a secret key, we use the OpenAI-compatible endpoint which is more robust
    const endpoint = 'https://text.pollinations.ai/openai/chat/completions';
    
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (apiKey) {
        // Pass the Pollinations Secret
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
        model: modelId, 
        seed: seed,
        temperature: 0.7,
        max_tokens: 4096 // Allow long responses
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
    
    // Extract content from OpenAI format
    const responseText = data.choices?.[0]?.message?.content;
    
    if (!responseText) {
        throw new Error("Respons kosong dari server AI.");
    }

    return responseText;

  } catch (error: any) {
    console.error("Pollinations Service Error:", error);
    
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
         throw new Error("Koneksi internet tidak stabil. Periksa koneksi Anda.");
    }

    throw new Error(error.message || "Gagal terhubung ke layanan Pollinations.");
  }
};
