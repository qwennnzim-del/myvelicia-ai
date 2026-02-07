
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // The third argument '' means load all env vars, not just VITE_ prefixed ones.
  // Fix: Cast process to any to avoid type errors if @types/node is missing or conflicting
  const cwd = (process as any).cwd();
  const env = loadEnv(mode, cwd, '');
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        // Fix: __dirname might not be available or typed, use cwd relative path
        '@': path.resolve(cwd, './'),
      },
    },
    define: {
      // Prioritas: 
      // 1. Env dari file (.env) via loadEnv
      // 2. Env dari System (Vercel Dashboard) via process.env
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY || env.GEMINI_API_KEY),
      'process.env.POLLINATIONS_API_KEY': JSON.stringify(env.POLLINATIONS_API_KEY || process.env.POLLINATIONS_API_KEY)
    }
  };
});
