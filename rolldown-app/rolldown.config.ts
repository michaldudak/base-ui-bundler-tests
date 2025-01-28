import { defineConfig } from 'rolldown';

export default defineConfig({
  input: 'index.tsx',
  output: {
    file: 'dist/index.min.js',
    minify: true,
  },
});
