const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const VueLoaderPlugin = require('vue-loader').VueLoaderPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  stats: 'errors-warnings',

  entry: {
    main: path.resolve(__dirname, 'src/main.js'),
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash:8].js',
    chunkFilename: '[name].[hash:8].js',
    publicPath: '/',
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      vue$: 'vue/dist/vue.runtime.esm.js',
    },
    extensions: ['*', '.mjs', '.js', '.jsx', '.vue', '.json', '.wasm'],
  },

  module: {
    rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },

      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },

      {
        test: /\.(css|sass|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ],
      },

      {
        test: /\.(ico|gif|png|jpg|jpeg|svg|eot|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[contenthash:8].[ext]',
          esModule: false,
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'vue2-webpack4-bulma-frontend',
      template: path.resolve(__dirname, 'src/index.html'),
      favicon: path.resolve(__dirname, 'src/assets/favicon.ico'),
    }),
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[name].[contenthash:8].css',
    }),
  ],

  optimization: {
    moduleIds: 'hashed',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -10,
          chunks: 'all',
        },
      },
    },
  },

  devServer: {
    stats: 'errors-warnings',
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, './dist'),
    port: 9000,
  },
};
