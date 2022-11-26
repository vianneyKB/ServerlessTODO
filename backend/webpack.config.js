const path = require('path');
const slsw = require('serverless-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// var nodeExternals = require('webpack-node-externals')

module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  // externals: [nodeExternals()],
  // entry: 'index.tsx',
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
  },
  
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname + '/dist', '.webpack'),
    filename: '[name].js',
    // path: __dirname + '/dist',
    // publicPath: '/',
    // filename: 'index_bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin()
  ],
  target: 'node',
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: 'ts-loader' },
    ],
  },
};
