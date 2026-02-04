import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Menggunakan '.' alih-alih process.cwd() untuk menghindari isu tipe Node.
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [react()],
    define: {
      // Vite akan me-replace string ini dengan nilai dari environment variable saat build
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.GEMINI_API_KEY)
    }
  };
});