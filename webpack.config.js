const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DotEnv = require('dotenv-webpack');

module.exports = {
  entry: {
    content_script: './src/content_script.js',
    background: './src/background/background.js',
    options: './src/options/options.js',
  },
  output: {
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader' },
      { test: /\.vue$/, use: 'vue-loader' },
      { test: /\.css$/, use: ['vue-style-loader', 'css-loader'] },
      { test: /\.scss$/, use: ['vue-style-loader', 'css-loader', 'sass-loader'] },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new DotEnv(),
    new CopyWebpackPlugin([
      {
        from: 'manifest.json',
      },
      {
        from: '**/*.html',
        context: 'src',
      },
      {
        from: '**/*',
        to: 'icons/',
        context: 'icons',
      },
      {
        from: '**/*',
        to: 'images/',
        context: 'images',
      },
    ]),
  ],
};
