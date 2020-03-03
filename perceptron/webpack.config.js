/* eslint-disable */

const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const sinTangentConfig = {
  entry: {
    main: './src/sin-tangent/index.ts'
  },
  output: {
    filename: 'sin-tangent/script.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'development',
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: 'ts-loader',
    }]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [new HtmlWebpackPlugin({
    title: 'Sin Tangent',
    template: 'templates/canvas.html',
    filename: 'sin-tangent/index.html'
  })]
};

module.exports = [ sinTangentConfig ];
