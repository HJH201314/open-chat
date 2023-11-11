import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import sassDts from 'vite-plugin-sass-dts'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    sassDts({
      enabledMode: ['development', 'production'],
      global: {
        generate: true,
        outputFilePath: path.resolve(__dirname, './src/style.d.ts'),
      },
      sourceDir: path.resolve(__dirname, './src'),
      outputDir: path.resolve(__dirname, './dist'),
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000/',
        changeOrigin: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
