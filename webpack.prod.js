const glob = require('glob')

const merge = require('webpack-merge').merge;
const common = require('./webpack.common.js');

const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
    ],
  },

  devServer: {
    compress: true,
    watchContentBase: true,
  }
});
