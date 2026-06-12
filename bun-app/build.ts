const result = await Bun.build({
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  entrypoints: ['./index.tsx'],
  env: 'disable',
  minify: true,
  naming: {
    entry: '[name].js',
  },
  outdir: './dist',
  sourcemap: 'external',
  target: 'browser',
});

for (const log of result.logs) {
  console.error(log);
}

if (!result.success) {
  process.exit(1);
}

export {};
