import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "/", // Ensure this matches the root of your deployment
  server: {
    proxy: {
      '/api': {
        target: 'https://dsa-tracker-dashboard-hhgo.vercel.app',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
