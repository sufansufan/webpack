const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack');
module.exports = {
  mode: 'production',
  devServer: {
    port: 3000
  },
  // 多入口
  entry: {
    home: './src/index.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {from: 'doc', to: ''}
    ]),
    new webpack.BannerPlugin('make 2019 by sufan')
  ],
  devtool: 'eval-source-map',
  // watch: true,
  // watchOptions: { //监控选项
  //   poll: 1000, //每秒询问1000次
  //   aggregateTimeout: 500, //防抖 我一直输入代码不打包
  //   ignored: /node_modules/ //忽略监控
  // },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}
