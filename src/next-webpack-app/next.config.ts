import type { NextConfig } from 'next';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'dist',
  webpack(config, { webpack }) {
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /^\.\.\/node_modules\/\.pnpm\/next@.*\/node_modules\/next\/dist\/client\/components\/builtin\/global-not-found\.js$/,
        require.resolve('next/dist/client/components/builtin/global-not-found.js'),
      ),
    );

    return config;
  },
};

export default nextConfig;
