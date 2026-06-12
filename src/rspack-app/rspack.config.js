const rspack = require('@rspack/core');

module.exports = {
  entry: './src/index.tsx',
  output: {
    clean: true,
    filename: 'static/js/[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'builtin:swc-loader',
        options: {
          jsc: {
            parser: {
              syntax: 'typescript',
              tsx: true,
            },
            transform: {
              react: {
                runtime: 'automatic',
              },
            },
          },
        },
        type: 'javascript/auto',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  performance: false,
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: './src/index.html',
    }),
  ],
};
