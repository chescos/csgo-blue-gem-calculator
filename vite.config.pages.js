import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  root: 'client',
  server: {
    host: true,
  },
  plugins: [tailwindcss()],
  build: {
    outDir: '../pages',
    emptyOutDir: true,
  },
});
