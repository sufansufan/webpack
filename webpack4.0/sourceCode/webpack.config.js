const path = require('path')
const TerserJSPlugin = require('terser-webpack-plugin') //陪优化项，进行js的压缩
const HtmlWebpackPlugin = require("html-webpack-plugin") // html插件
const MiniCssExtractPlugin = require("mini-css-extract-plugin") // 抽离css文件
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin') //优化css
module.exports = {
  optimization: { //优化项
    minimizer: [
      new TerserJSPlugin({
        cache: true, // 是否使用缓存
        parallel: true, // 是否平行打包
        sourceMap: true, //源码映射
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  devServer: { //开发服务配置
    port: 3000,
    progress: true,
    contentBase: './dist',
    compress: true,
    // open: true,
  },
  mode: 'development', // 模式 默认有两种模式 development 和 production
  entry: './src/index.js', //入口文件
  output: {
    filename: 'bundle.[hash:8].js', //打包的文件名
    path: path.resolve(__dirname, 'dist'),  //路径必须是绝对路径
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // 模板文件
      filename: 'index.html', // 打包的html文件名
      minify: { // 压缩html
        removeAttributeQuotes: true,  //移除双引号
        collapseWhitespace: true,  // 移除html中的换行
      },
      hash: true, // 引入hash戳
    }),
    new MiniCssExtractPlugin({
      filename: 'main.css'
    })
  ],
  module: {
    rules: [
      // {
      //   test: /\.js/,
      //   use: {
      //     loader: 'eslint-loader',
      //     enforce: 'pre' // post 之后
      //   }
      // },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
            ],
            plugins: [
              ["@babel/plugin-proposal-decorators", { "legacy": true }],
              ["@babel/plugin-proposal-class-properties", { "loose" : true }],
              "@babel/plugin-transform-runtime"
            ]
          }
        },
      },
      {
        test: /\.css$/,
        use: [
          // {
          //   loader: 'style-loader',
          //   options: {
          //     insertAt: 'top' //style标签插入的位置
          //   }
          // },
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          // {
          //   loader: 'style-loader',
          //   options: {
          //     insertAt: 'top'
          //   }
          // },
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      }
    ]
  }
}
