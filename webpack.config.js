const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const VueLoaderPlugin = require('vue-loader').VueLoaderPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HotModuleReplacementPlugin = require('webpack').HotModuleReplacementPlugin;
const DefinePlugin = require('webpack').DefinePlugin;
const CopyPlugin = require('copy-webpack-plugin');
const VuetifyLoaderPlugin = require('vuetify-loader').VuetifyLoaderPlugin;

module.exports = (env, argv) => {

  let devMode = (argv.mode === 'development');

  let buildSettings = {
    production: !devMode,
    cordova: process.env.CORDOVA === 'true',
    contentMode: process.env.CONTENT_MODE,
  }

  console.log('POODLE BUILD SETTINGS');
  console.log('  production  : ' + buildSettings.production);
  console.log('  cordova     : ' + buildSettings.cordova);
  console.log('  content mode: ' + buildSettings.contentMode);

  let plugins = [
    new DefinePlugin({
      PRODUCTION: JSON.stringify(buildSettings.production),
      CORDOVA: JSON.stringify(buildSettings.cordova),
      CONTENT_MODE: JSON.stringify(buildSettings.contentMode),
    }),

    new HtmlWebpackPlugin({
      title: 'Poodle',
      template: path.resolve(__dirname, buildSettings.cordova
          ? 'src/index-cordova.html' : 'src/index-plain.html'),
      favicon: path.resolve(__dirname, 'src/assets/favicon.ico'),
      filename: 'index.html',
    }),

    new CleanWebpackPlugin(),

    new VueLoaderPlugin(),

    new VuetifyLoaderPlugin({
      progressiveImages: {
        sharp: true,
      }
    }),

    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
    }),
  ];

  if(!buildSettings.production) {
    plugins.push(new HotModuleReplacementPlugin());
  }

  if(buildSettings.cordova) {
    patterns = [ { from: 'src/cordova.css' }, ];

    if(buildSettings.contentMode && buildSettings.contentMode == 'remote') {
      patterns.push({ from: 'platforms/android/platform_www/cordova.js' });
      patterns.push({ from: 'platforms/android/platform_www/cordova_plugins.js' });
      // TODO: add me as soon as we have platform plugins
      // patterns.push({ from: 'platforms/android/platform_www/plugins' });
    }

    plugins.push(new CopyPlugin({patterns: patterns}));
  }

  return {
    target: buildSettings.production ? undefined : 'web',

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
            buildSettings.production ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'postcss-loader',
            {
              loader: 'sass-loader',
              options: {
                implementation: require('sass'),
              },
            },
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

    devtool: buildSettings.production ? 'source-map' : 'eval-source-map',

    optimization: buildSettings.production ? {
      removeAvailableModules: true,

      minimize: true,

      minimizer: [
        new TerserPlugin({
          terserOptions: { }
        }),

        new CssMinimizerPlugin({
          sourceMap: false,
        }),
      ],
    } : {},

    entry: {
      main: path.resolve(__dirname, 'src/index.js'),
    },

    output: {
      path: path.resolve(__dirname,
        buildSettings.contentMode === 'local' ? 'www' : 'dist'),
      filename: '[name].[hash:8].js',
      chunkFilename: '[name].[hash:8].js',
      publicPath: buildSettings.cordova ? '' : '/',
    },

    devServer: {
      port: 9000,
      host: '0.0.0.0',
      compress: true,
      historyApiFallback: true,
      contentBase: path.resolve(__dirname, './dist'),
      hot: buildSettings.production ? false : true,
    },
  };
}

