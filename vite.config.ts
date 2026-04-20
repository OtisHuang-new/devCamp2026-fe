/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom', // Bật trình duyệt ảo ở đây
    setupFiles: './src/setupTests.ts', // Chạy file setup trước khi test
  },
});
