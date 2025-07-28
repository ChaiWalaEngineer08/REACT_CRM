import react from '@vitejs/plugin-react'

const { defineConfig } = require('vite')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
