const path = require('path');
const donePlugin = require('./plugins/DonePlugin')
const asyncPlugin = require('./plugins/AsyncPlugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FileListPlugin = require('./plugins/FileListPlugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const InlineSourcePlugin = require('./plugins/InlineSourcePlugin')
const UploadPlugin = require('./plugins/UploadPlugin')
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'hppt://img.fullstackjavascript.cn/' // 在这个目录下面查找文件
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'main.css'
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new FileListPlugin({
      filename: 'list.md'
    }),
    new UploadPlugin({
      bucket: 'jwstatic', // 上传到那个资源上
      domain: 'img.fullstackjavascript.cn', // 上传的域名上面
      accessKey: '', // 进入的key
      secretKey: '' // 密钥
    })
    // new InlineSourcePlugin({
    //   match: /\.(js|css)/
    // })
    // new donePlugin(),
    // new asyncPlugin()
  ]

}
