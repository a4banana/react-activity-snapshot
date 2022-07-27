import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: true,
    cors: true
  },
  resolve: {
    alias: {
      '@': resolve( __dirname, './src' )
    }    
  },
  plugins: [react({ jsxRuntime: 'classic' }), mkcert()]
})
