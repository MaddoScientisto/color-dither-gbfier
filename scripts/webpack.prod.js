const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { merge } = require('webpack-merge');
const { EnvironmentPlugin } = require('webpack');
const common = require('./webpack.common');

module.exports = merge(common(), {
  mode: 'production',
  devtool: false,
  stats: 'errors-warnings',
  performance: {
    maxEntrypointSize: 500000,
    maxAssetSize: 500000,
  },
  plugins: [
    new EnvironmentPlugin({ PUBLIC_URL: 'https://maddoscientisto.github.io/color-dither-gbfier' }),
    new CopyPlugin({
      patterns: [
        {
          from: path.join(process.cwd(), 'src', 'assets', 'gradient.png'),
          to: path.join(process.cwd(), 'dist', 'gradient.png'),
        },
        {
          from: path.join(process.cwd(), 'src', 'assets', 'favicon.ico'),
          to: path.join(process.cwd(), 'dist', 'favicon.ico'),
        },
        {
          from: path.join(process.cwd(), 'src', 'assets', 'manifest.webmanifest'),
          to: path.join(process.cwd(), 'dist', 'manifest.webmanifest'),
        },
        {
          from: path.join(process.cwd(), 'src', 'assets', 'pwa-assets'),
          to: path.join(process.cwd(), 'dist', 'pwa-assets'),
        },
        {
          from: path.join(process.cwd(), 'src', 'javascript', 'service-worker.js'),
          to: path.join(process.cwd(), 'dist', 'service-worker.js'),
        },
      ],
    }),
  ],
});
