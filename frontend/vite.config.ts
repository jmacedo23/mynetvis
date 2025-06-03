import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      cesium: path.resolve(__dirname, 'node_modules/cesium/Source')
    }
  },
  define: {
    CESIUM_BASE_URL: JSON.stringify('/cesium')
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3000
  }
})

