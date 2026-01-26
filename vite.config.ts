import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Fix: Cast process to any to avoid type error with cwd() in environments where Node types are missing
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Fix: Use API_KEY as per Google GenAI guidelines
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.GEMINI_API_KEY)
    }
  };
});