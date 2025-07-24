import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'  // <-- important, add this!

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),  // map '@' to './src'
    },
  },
  build: {
    chunkSizeWarningLimit: 2000,  // optional, to silence warnings about chunk size
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-react'
            return 'vendor'
          }
        },
      },
    },
  },
})
