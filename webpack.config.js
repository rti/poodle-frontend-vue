const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const VueLoaderPlugin = require('vue-loader').VueLoaderPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HotModuleReplacementPlugin = require('webpack').HotModuleReplacementPlugin;


module.exports = (env, argv) => {

  let devMode = (argv.mode === 'development');

  let plugins = [
    new HtmlWebpackPlugin({
      title: 'Poodle',
      template: path.resolve(__dirname, 'src/index.html'),
      favicon: path.resolve(__dirname, 'src/assets/favicon.ico'),
      filename: 'index.html',
    }),

    new CleanWebpackPlugin(),

    new VueLoaderPlugin(),

    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
    }),
  ];

  if(devMode) {
    plugins.push(new HotModuleReplacementPlugin());
  }

  return {
    target: devMode ? 'web' : undefined,

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },

        {
          test: /\.vue$/,
          use: ['vue-loader'],
        },

        {
          test: /\.(css|sass|scss)$/,
          use: [
            devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ],
        },

        {
          test: /\.(?:ico|gif|png|jpg|jpeg|)$/i,
          type: 'asset/resource',
        },

        {
          test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
          type: 'asset/resource',
        },
      ],
    },

    plugins: plugins,

    devtool: devMode ? 'eval-source-map' : 'source-map',

    optimization: devMode ? {} : {
      removeAvailableModules: true,

      minimize: true,

      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
          terserOptions: { }
        }),

        new CssMinimizerPlugin({
          sourceMap: false,
        }),
      ],
    },

    entry: {
      main: path.resolve(__dirname, 'src/index.js'),
    },

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[hash:8].js',
      chunkFilename: '[name].[hash:8].js',
      publicPath: '/',
    },

    devServer: {
      port: 9000,
      compress: true,
      historyApiFallback: true,
      contentBase: path.resolve(__dirname, './dist'),
      hot: devMode ? true : false,
    },
  };
}

