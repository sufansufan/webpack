const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
// const Happypack = require('happypack')  // 使用多线程进行打包
module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js'
    // other: './src/other.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    hot: true,
    port: 3000,
    open: true,
    contentBase: './dist'
  },
  // optimization: {
  //   splitChunks: { // 分割代码块
  //     cacheGroups: { // 缓存组
  //       common: {
  //         chunks: 'initial',
  //         minSize: 0,
  //         minChunks: 2,
  //       },
  //       vendor: { // 抽离第三方包 例如jquery
  //         priority: 1, //设置优先级
  //         test: /node_modules/,
  //         chunks: 'initial',
  //         minSize: 0,
  //         minChunks: 2,
  //       }
  //     }
  //   }
  // },
  module: {
    noParse: /jquery/, //不去解析jquery中依赖库
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: path.resolve('src'),
        // use: 'Happypack/loader?id=js'  // 使用多线程进行打包
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
            ]
          }
        }
      }
    ]
  },
  plugins: [
    // new Happypack ({
    //   id: 'js',
    //   use: [{
    //     loader: 'babel-loader',
    //     options: {
    //       presets: [
    //         '@babel/preset-env',
    //         '@babel/preset-react',
    //       ]
    //     }
    //   }]
    // }),
    // new webpack.DllReferencePlugin({
    //   manifest: path.resolve(__dirname, 'dist', 'manifest.json')
    // }),
    // new webpack.IgnorePlugin(/\.\/locale/, /moment/),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new webpack.NamedModulesPlugin(), // 打印模块更新的路径
    new webpack.HotModuleReplacementPlugin() // 热更新插件
  ]
}
