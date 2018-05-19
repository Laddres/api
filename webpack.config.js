'use strict'

const path = require('path');
const webpack = require('webpack');
const fs = require('fs');

const nodeModules = {};
fs.readdirSync(path.resolve(__dirname, 'node_modules'))
  .filter(x => ['.bin'].indexOf(x) === -1)
  .forEach(mod => { nodeModules[mod] = `commonjs ${mod}`; });

module.exports = {
  devtool: 'source-map',
  mode: 'development',

  target: 'node',
  externals: nodeModules,

  entry: [
    path.join(__dirname, 'src', 'index'),
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
