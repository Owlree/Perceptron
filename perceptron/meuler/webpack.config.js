/* eslint-disable */

const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const meulerConfig = {
  entry: {
    main: './src/index.ts'
  },
  output: {
    filename: 'script.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'development',
  module: {
    rules: [{
      test: /\.ts$/,
      loader: 'ts-loader',
    }]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [new HtmlWebpackPlugin({
    title: 'Euler Method',
    template: 'canvas-template.html',
    filename: 'index.html'
  })]
};

module.exports = [meulerConfig];
