/* eslint-disable */

const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const treedeeConfig = {
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
    title: '3D in 2D',
    template: 'canvas-template.html',
    filename: 'index.html'
  })]
};

module.exports = [treedeeConfig];
