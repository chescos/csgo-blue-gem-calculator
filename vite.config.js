import { resolve } from 'path';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  root: 'client',
  server: {
    host: true,
  },
  plugins: [tailwindcss()],
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      name: 'BlueGemCalculator',
      fileName: 'blue-gem-calculator',
    },
    outDir: '../dist',
    emptyOutDir: true,
    terserOptions: {
      compress: {
        pure_funcs: ['console.log'],
      },
    },
  },
  test: {
    root: './lib',
  },
});
