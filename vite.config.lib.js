import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      name: 'BlueGemCalculator',
      fileName: 'blue-gem-calculator',
    },
    outDir: './dist',
    emptyOutDir: true,
  },
});
