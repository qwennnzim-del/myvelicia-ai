
import { Message, Role } from '../types';

export const sendToPollinations = async (
  text: string,
  history: Message[],
  systemInstruction: string
): Promise<string> => {
  try {
    // 1. Format Messages for OpenAI-style API
    // Pollinations accepts: [{ role: "system"|"user"|"assistant", content: "..." }]
    const messages = history.map(msg => ({
      role: msg.role === Role.MODEL ? 'assistant' : 'user',
      content: msg.text
    }));

    // Add the new user message
    messages.push({ role: 'user', content: text });

    // Prepend System Instruction
    messages.unshift({ role: 'system', content: systemInstruction });

    // 2. Random Seed for variety (optional but good for uniqueness)
    const seed = Math.floor(Math.random() * 1000000);

    // 3. Call Pollinations API
    // Endpoint: https://text.pollinations.ai/
    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages,
        model: 'openai', // This requests the OpenAI model via Pollinations
        seed: seed,
        jsonMode: false
      }),
    });

    if (!response.ok) {
      throw new Error(`Pollinations API Error: ${response.statusText}`);
    }

    // Pollinations returns the text directly as string
    const responseText = await response.text();
    return responseText;

  } catch (error: any) {
    console.error("Pollinations Service Error:", error);
    throw new Error("Gagal terhubung ke jaringan OpenAI via Pollinations.");
  }
};
