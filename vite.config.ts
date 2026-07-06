import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      // Resolve workspace package to local lib for Vercel build
      '@workspace/api-client-react': path.resolve(
        import.meta.dirname,
        './lib/api-client-react/src/index.ts',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-motion': ['framer-motion'],
          'vendor-router': ['wouter'],
          'vendor-ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-accordion',
            'cmdk',
            'sonner',
            'vaul',
          ],
          'vendor-charts': ['recharts'],
          'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
    allowedHosts: true,
  },
  preview: {
    port: 4173,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
