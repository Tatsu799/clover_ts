const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/main.ts',
  output: {
    // filename: 'bundle.[contenthash].js',//別の設定方法
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
  },
  module: {
    rules: [
      //ローダーを適用するルールwebpackのコンパイルについて
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [new CleanPlugin.CleanWebpackPlugin()],
};
