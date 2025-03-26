import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        overlay: resolve(__dirname, 'src/VoiceParsingOverlay.jsx')
      },
      output: {
        entryFileNames: 'reactOverlay.bundle.js',
        format: 'iife', // Important: for Chrome extension compatibility
      }
    },
    outDir: 'dist',
    emptyOutDir: false,
  }
})