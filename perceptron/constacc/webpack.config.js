/* eslint-disable */

const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const constaccConfig = {
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
    title: 'Constant Acceleration',
    template: 'canvas-template.html',
    filename: 'index.html'
  })]
};

module.exports = [constaccConfig];
