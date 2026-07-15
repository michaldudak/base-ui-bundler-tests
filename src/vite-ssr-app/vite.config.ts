import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  ssr: {
    noExternal: ['@base-ui/react'],
  },
});
