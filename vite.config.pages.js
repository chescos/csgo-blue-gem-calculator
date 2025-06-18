import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  root: 'client',
  server: {
    host: true,
  },
  plugins: [tailwindcss(), vue()],
  build: {
    outDir: '../pages',
    emptyOutDir: true,
  },
});
