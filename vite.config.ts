// Dummy vite config to satisfy Lovable's build system
// This backend project doesn't actually use Vite for building
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 8080
  },
  // Empty config - this is just to prevent build errors
  build: {
    lib: {
      entry: 'src/server.ts',
      name: 'backend'
    }
  }
});