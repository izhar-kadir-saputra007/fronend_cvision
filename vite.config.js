import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  assetsInclude: ['**/*.glb'],
  
  server: {
    host: true, // penting agar bisa diakses dari luar (misalnya lewat ngrok)
    allowedHosts: ['.ngrok-free.app'], // izinkan domain ngrok
    port: 5173 // atau port lain yang kamu pakai
  }
})
