// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-expect-error: no types available for NodeGlobalsPolyfillPlugin
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
// @ts-expect-error: no types available for NodeModulesPolyfillPlugin
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'

export default defineConfig({
  plugins: [
    react(),
    // @ts-expect-error: plugin has no types
    NodeGlobalsPolyfillPlugin({
      buffer: true,
      process: true
    }),
    // @ts-expect-error: plugin has no types
    NodeModulesPolyfillPlugin()
  ],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  resolve: {
    alias: {
      crypto: 'crypto-browserify'
    }
  },
  server: {
    host: true,
    port: 3000
  }
})

