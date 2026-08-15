import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// base: en build para GitHub Pages el sitio se sirve en /digecog-library/ (proyecto, no dominio raíz).
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/digecog-library/' : '/',
  plugins: [react(), tailwindcss()],
}))
