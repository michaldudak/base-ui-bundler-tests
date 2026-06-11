const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const baseUiReactPath = path.dirname(require.resolve('@base-ui/react/package.json'));

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  resolve: {
    alias: {
      '#prehydration/slider/thumb': path.join(
        baseUiReactPath,
        'slider/thumb/prehydrationScript.stub.js',
      ),
      '#prehydration/tabs/indicator': path.join(
        baseUiReactPath,
        'tabs/indicator/prehydrationScript.stub.js',
      ),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
    }),
  ],
  devServer: {
    static: './dist',
    hot: true,
  },
  mode: 'development',
};
