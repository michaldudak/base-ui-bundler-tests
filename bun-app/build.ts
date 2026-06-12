const result = await Bun.build({
  entrypoints: ['./index.tsx'],
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
