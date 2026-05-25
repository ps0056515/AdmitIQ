import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function createWebConfig(port: number) {
  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        '@admitiq/ui': path.resolve(rootDir, 'packages/ui/src'),
        '@admitiq/api-client': path.resolve(rootDir, 'packages/api-client/src'),
      },
    },
    server: { port },
  });
}
