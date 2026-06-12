import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
    server: {
      deps: {
        inline: [/@mui/, /@emotion/, /react-transition-group/],
      },
    },
  },
  resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
},
});