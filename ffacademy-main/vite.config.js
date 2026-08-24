import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// When deploying to GitHub Pages, set VITE_BASE_URL to /<repo-name>/ (see .env.example).
export default defineConfig({
  base: process.env.VITE_BASE_URL || '/',
  logLevel: 'error', // Suppress warnings, only show errors
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
