import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://lanelayer-analytics.fly.dev',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  preview: {
    proxy: {
      '/api': {
        target: 'https://lanelayer-analytics.fly.dev',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
