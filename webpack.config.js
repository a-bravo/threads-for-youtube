const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  entry: {
    'content_script': './src/content_script.js',
    'background': './src/background/background.js',
    'options': './src/options/options.js',
  },
  output: {
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader' },
      { test: /\.vue$/, use: 'vue-loader' },
      { test: /\.css$/, use: ['vue-style-loader', 'css-loader']},
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
  ]
};
