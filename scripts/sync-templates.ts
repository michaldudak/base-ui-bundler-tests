import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

interface CopyPlan {
  targets: string[];
  template: string;
}

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const copies: CopyPlan[] = [
  {
    template: 'BaseUiFixture.tsx',
    targets: [
      'src/astro-app/src/components/BaseUiFixture.tsx',
      'src/bun-app/BaseUiFixture.tsx',
      'src/esbuild-app/BaseUiFixture.tsx',
      'src/jest-tests/BaseUiFixture.tsx',
      'src/next-app/src/app/BaseUiFixture.tsx',
      'src/next-webpack-app/src/app/BaseUiFixture.tsx',
      'src/parcel-app/BaseUiFixture.tsx',
      'src/react-router-app/app/BaseUiFixture.tsx',
      'src/rollup-app/BaseUiFixture.tsx',
      'src/rolldown-app/BaseUiFixture.tsx',
      'src/rsbuild-app/src/BaseUiFixture.tsx',
      'src/rspack-app/src/BaseUiFixture.tsx',
      'src/vite-app/src/BaseUiFixture.tsx',
      'src/vite-swc-app/src/BaseUiFixture.tsx',
      'src/vite-ssr-app/src/BaseUiFixture.tsx',
      'src/webpack-4-app/src/BaseUiFixture.tsx',
      'src/webpack-5-app/src/BaseUiFixture.tsx',
    ],
  },
  {
    template: 'node-esm-index.js',
    targets: ['src/node-esm-app/index.js'],
  },
  {
    template: 'node-cjs-index.js',
    targets: ['src/node-cjs-app/index.js'],
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
