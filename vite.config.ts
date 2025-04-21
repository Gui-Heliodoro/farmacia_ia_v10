// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/farmacia_ia_v10/',      // ← aqui
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
