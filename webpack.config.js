'use strict'

const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  mode: 'development',
  target: 'node',

  entry: [
    path.join(__dirname, '', 'index'),
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'api.node.js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: /src/,
        enforce: 'pre',
        loader: 'eslint-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: /src/,
        loader: 'babel-loader',
      },
    ],
  },
}
