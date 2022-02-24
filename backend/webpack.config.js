const path = require('path')
const webpack = require('webpack')
const slsw = require('serverless-webpack')

module.exports = (async () => {
  return {
    mode: 'development',
    entry: slsw.lib.entries,
    target: 'node',
    output: {
      libraryTarget: 'umd',
      path: path.join(__dirname, './.webpack'),
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    devtool: 'source-map',
    resolve: {
      extensions: ['.ts', '.js'],
    },
    optimization: {
      splitChunks: { chunks: 'all' },
    },
  }
})()
