
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Ini memastikan kode Anda yang menggunakan `process.env.API_KEY` tetap berjalan
      // tanpa melanggar aturan SDK GenAI. Vite akan menggantinya saat build time.
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});
