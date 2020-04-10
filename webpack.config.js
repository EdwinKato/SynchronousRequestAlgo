const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const config = require('config');

/*-------------------------------------------------*/

module.exports = {
  // webpack optimization mode
  mode: process.env.NODE_ENV ? process.env.NODE_ENV : 'development',

  // entry file(s)
  entry: './src/index.ts',

  // output file(s) and chunks
  output: {
    // library: 'UserList',
    library: 'makeRequest',
    libraryTarget: 'umd',
    globalObject: '(typeof self !== "undefined" ? self : this)',
    libraryExport: 'default',
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    publicPath: config.get('publicPath'),
  },

  resolve: {
    // Add '.ts' as resolvable extensions.
    extensions: [".webpack.js", ".web.js", ".ts", ".js"]
  },

  // module/loaders configuration
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
    ],
  },

  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
    }),
  ],

  // development server configuration
  devServer: {
    // must be `true` for SPAs
    historyApiFallback: true,

    // open browser on server start
    open: config.get('open'),
  },

  // generate source map
  devtool:
    process.env.NODE_ENV === 'production'
      ? 'source-map'
      : 'cheap-module-eval-source-map',
};
