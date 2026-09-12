import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vuetify({ autoImport: true })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    // Necessário para detectar alterações de arquivo via bind mount do
    // Docker Desktop (Windows/macOS), onde eventos nativos do FS nem sempre
    // chegam ao container — o Vite passa a checar o disco por polling.
    watch: {
      usePolling: true,
      interval: 300,
    },
  },
});
