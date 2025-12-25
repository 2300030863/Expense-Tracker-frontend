
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  // Use root path for all environments
  base: '/',
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    host: true, // Allow external connections
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
}))
