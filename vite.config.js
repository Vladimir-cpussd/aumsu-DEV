import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://10.242.2.77:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'), 
        secure: false, 
      },
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
        catalog: './src/pages/view_kat/view_kat.html',
      },
    },
  },
});