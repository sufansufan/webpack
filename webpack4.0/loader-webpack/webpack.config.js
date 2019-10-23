const path = require('path');
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'build.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, 'loaders')]
    // 别名
    // alias: {
    //   loader1: path.resolve(__dirname, 'loaders', 'loader1.js')
    // }
  },
  watch: true,
  devtool: 'source-map',
  module: {
    // loader的分类 pre 在前面的 post 在后面 normal 正常的loader
    // loader的顺序 pre => normal => inline行内的 => post
    /* rules: [ // loader顺序问题从右向左，从下到上
      {
        test: /\.js$/,
        // use: path.resolve(__dirname, 'loaders', 'loader1.js')
        // use: 'loader1'
        // 配置多个loader
        // use: ['loader3', 'loader2', 'loader1']
        use: {
          loader: 'loader3'
        }
      },
      {
        test: /\.js$/,
        use: {
          loader: 'loader2'
        }
      },
      {
        test: /\.js$/,
        use: {
          loader: 'loader1'
        }
      }
    ] */
    rules: [
      {
        test: /\.less$/,
        use: ['style-loader','css-loader','less-loader']
      },
      {
        test: /\.png$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 200 * 1024
          }
        }
      },
      {
        test: /\.js$/,
        use: { /* sufan */
          loader: 'banner-loader',
          options: {
            text: 'sufan',
            filename: path.resolve(__dirname, 'banner.js')
          }
        }
      }
      // {
      //   test: /\.js$/,
      //   use: {
      //     loader: 'babel-loader',
      //     options: {
      //       presets: [
      //         '@babel/preset-env'
      //       ]
      //     }
      //   }
      // }
    ]
  }
}
