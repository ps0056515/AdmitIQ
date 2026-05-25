import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@admitiq/ui': path.resolve(rootDir, 'packages/ui/src') },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.tsx'),
      name: 'AdmitIQWidget',
      fileName: 'admitiq-widget',
      formats: ['es'],
    },
  },
  server: { port: 5176 },
});
