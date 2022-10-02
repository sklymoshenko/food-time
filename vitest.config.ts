import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/testSetup.ts',
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['src/styled', 'src/*.ts', 'src/components/*.test.tsx'],
      watermarks: {
        statements: [90, 95],
        functions: [90, 95],
        branches: [90, 95],
        lines: [90, 95],
      },
    },
  },
})
