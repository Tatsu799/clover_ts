const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/main.ts',
  output: {
    // filename: 'bundle.[contenthash].js',//動的にファイル名を返る（一意のハッシュ値を生成）
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist',
  },
  devServer: {
    static: [
      {
        directory: path.resolve(__dirname, 'dist'),
        publicPath: '/dist',
      },
      {
        directory: __dirname,
        publicPath: '/',
      },
    ],
  },
  devtool: 'eval',
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
};
