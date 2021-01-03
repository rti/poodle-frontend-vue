const path = require('path');

const webpack = require('webpack');
const merge = require('webpack-merge').merge;
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',

  devServer: {
    compress: false,
    hot: true,
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
});
