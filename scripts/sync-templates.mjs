import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const copies = [
  {
    template: 'BaseUiFixture.tsx',
    targets: [
      'astro-app/src/components/BaseUiFixture.tsx',
      'bun-app/BaseUiFixture.tsx',
      'esbuild-app/BaseUiFixture.tsx',
      'jest-tests/BaseUiFixture.tsx',
      'next-app/src/app/BaseUiFixture.tsx',
      'next-webpack-app/src/app/BaseUiFixture.tsx',
      'parcel-app/BaseUiFixture.tsx',
      'react-router-app/app/BaseUiFixture.tsx',
      'rollup-app/BaseUiFixture.tsx',
      'rolldown-app/BaseUiFixture.tsx',
      'rsbuild-app/src/BaseUiFixture.tsx',
      'rspack-app/src/BaseUiFixture.tsx',
      'vite-app/src/BaseUiFixture.tsx',
      'vite-swc-app/src/BaseUiFixture.tsx',
      'vite-ssr-app/src/BaseUiFixture.tsx',
      'webpack-4-app/src/BaseUiFixture.tsx',
      'webpack-5-app/src/BaseUiFixture.tsx',
    ],
  },
  {
    template: 'node-esm-index.js',
    targets: ['node-esm-app/index.js'],
  },
  {
    template: 'node-cjs-index.js',
    targets: ['node-cjs-app/index.js'],
  },
];

for (const copy of copies) {
  const source = path.join(rootDir, 'templates', copy.template);

  await Promise.all(
    copy.targets.map(async (target) => {
      const destination = path.join(rootDir, target);
      await mkdir(path.dirname(destination), { recursive: true });
      await copyFile(source, destination);
    }),
  );
}
