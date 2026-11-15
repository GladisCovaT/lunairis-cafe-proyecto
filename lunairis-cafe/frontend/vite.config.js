import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  build: {
    // Los JS/CSS compilados van a /static para no chocar con la carpeta /assets (imágenes) de public/
    assetsDir: 'static',
    rollupOptions: {
      // Dos páginas, igual que el proyecto original: sitio público y panel admin
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        admin: fileURLToPath(new URL('./admin.html', import.meta.url))
      }
    }
  },
  server: {
    port: 5173,
    // En desarrollo, las llamadas a /api se redirigen al backend de Express
    proxy: { '/api': 'http://localhost:3000' }
  }
});
