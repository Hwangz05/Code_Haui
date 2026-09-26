import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: null, // Disable PostCSS search since project uses pure CSS Modules
  },
  server: {
    port: 3000,
    open: true,
  },
});