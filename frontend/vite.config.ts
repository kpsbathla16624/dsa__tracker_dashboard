import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://dsa-tracker-dashboard-hhgo.vercel.app', // Your backend server
        changeOrigin: true,
      },
    },
  },
})


