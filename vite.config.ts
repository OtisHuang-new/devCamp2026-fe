/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // 1. Cấu hình Alias cho @
  resolve: {
    alias: {
      '@Assets': path.resolve(__dirname, './src/shared/Assets'),
      '@': path.resolve(__dirname, './src'),
    },
  },

  test: {
    globals: true,
    environment: 'jsdom', // Bật trình duyệt ảo ở đây
    setupFiles: './src/test/setupTests.ts', // Chạy file setup trước khi test
  },
});
