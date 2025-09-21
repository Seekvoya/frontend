import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr(),
  ],
  css: {
    devSourcemap: true
  },
  server: {
    port: 3000, 
    host: '0.0.0.0',
    open: true,
  },
});