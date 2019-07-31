# webpack4.0

**webpack可以做的事情**

代码转换、文件优化、代码分割、模块合并、自动刷新、代码校验、自动发布*

**webpack需要掌握哪些内容**

- webpack常见配置
- webpack高级配置
- webpack优化策略
- ast抽象语法树
- webpack中Tapable
- 掌握webpack流程，手写webpack
- 手写webpack中常见的loader
- 手写webpack常见的plugin

## webpack常见配置

初始化package.json

```
npm init -y
```

安装webpack、webpack-cli

~~~
npm i webpack web0pack-cli -D
~~~

### 配置webpack配置文件

默认的是：webpack.config.js 

```
npx webpack --config webpack.config.my.js

npm run build -- --config webpack.config.my.js
```

**修改package.json中scripts**

```
"scripts": {
    "build": "webpack --config webpack.config.js",
    "test": "echo \"Error: no test specified\" && exit 1"
 },
```

#### html插件

```
const htmlWebpackPlugin = require("html-webpack-plugin")
```

##### 配置htmlwebpackplugin 

```
new htmlWebpackPlugin({
    template: './src/index.html', // 模板文件
    filename: 'index.html', // 打包的html文件名
    minify: { // 压缩html
        removeAttributeQuotes: true,  //移除双引号
        collapseWhitespace: true,  // 移除html中的换行
    },
    hash: true, // 引入hash戳
})

```

#### 配置css

**loader的特点**

- 希望是单一的 
- 字符串只用一个loader
- 多个loader需要用[ ]
- loader的顺序默认从右到左执行
- loader还可以写成对象的形式

需要使用style-loader和css-loader

**loader的这种类**

- 前置loader pre
- 普通loader normal
- 后置loader post
- 内联loader

**style-loader**

把css插入到head标签中

**css-loader**

用来解析@import这种语法

**处理css和less**

 insertAt: 'top'  //style标签插入的位置

```
rules: [
  {
    test: /\.css$/,
    use: [{
      loader: 'style-loader',
      options: {
        insertAt: 'top' 
      }
    }, 'css-loader']
  },
  {
    test: /\.less$/,
    use: [{
      loader: 'style-loader',
      options: {
        insertAt: 'top'
      }
    }, 'css-loader', 'less-loader']
  }
]
```

**抽离css**

在webpack4.0中使用的是mini-css-extract-plugin

```
new MiniCssExtractPlugin({
  filename: 'main.css'
})
rules: [
  {
    test: /\.css$/,
    use: [
      MiniCssExtractPlugin.loader,
      'css-loader',
      'postcss-loader'
    ]
  },
  {
    test: /\.less$/,
    use: [
      MiniCssExtractPlugin.loader,
      'css-loader',
      'postcss-loader',
      'less-loader'
    ]
  }
]
```

**css样式自动补全**

使用postcss-loader 、autoprefixer

**postcss.config.js**

```
module.exports = {
  plugins: [require('autoprefixer')]
}

```

**css进行优化**

优化项optimization

优化css的时候要配合使用 `terser-webpack-plugin` 或者 `uglifyjs-webpack-plugin` 不然对js文件不进行压缩

**terser-webpack-plugin插件的使用**

- **cache** 是否是用缓存
- **parallel** 是否是平行打包
- **sourceMap** 源码映射主要用es6转换es5进行修改

```
const TerserJSPlugin = require('terser-webpack-plugin') 
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
optimization: {
	minimizer: [
		new TerserJSPlugin({
            cache: true, 
            parallel: true, 
            sourceMap: true, 
		}),
        new OptimizeCSSAssetsPlugin({})
     ]
}
```

#### 配置js

##### 转换es6语法

**安装babel依赖**

```
npm i babel-loader @babel/core @babel/preset-env -D
```

**webpack进行配置**

处理es7中class类 

安装@babel/plugin-proposal-class-properties依赖

npm i @babel/plugin-proposal-class-properties -D

处理es7中修饰符类

安装 @babel/plugin-proposal-decorators依赖

```
npm i @babel/plugin-proposal-decorators -D
```

```
{
    test: /\.js$/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: [
          '@babel/preset-env',
        ],
        plugins: [
          ["@babel/plugin-proposal-decorators", { "legacy": true }],
          ["@babel/plugin-proposal-class-properties", { "loose" : true }]
        ]
      }
    }
 }
```

##### 处理js语法及校验

**处理promise语法、generator语法或者更高级的语法**

安装依赖

```
npm install --save-dev @babel/plugin-transform-runtime

npm install --save @babel/runtime

{
    test: /\.js$/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: [
          '@babel/preset-env',
        ],
        plugins: [
          ["@babel/plugin-proposal-decorators", { "legacy": true }],
          ["@babel/plugin-proposal-class-properties", { "loose" : true }],
          ["@babel/plugin-transform-runtime"]
        ]
      }
    },
    include: path.resolve(__dirname, 'src'),
    exclude: /node_modules/
 },
```

**处理es7中的includes**

安装依赖

```
npm install --save @babel/polyfill
```

引入

```
require("@babel/polyfill");
```

**eslint使用**

安装依赖

```
npm i eslint eslint-loader -D
```

webpack中配置

```
 {
    test: /\.js/,
    use: {
      loader: 'eslint-loader'
      enforce: 'pre'
    }
  },
```

#### 全局变量引入问题

**expose-loader**

- 内联loader
- 暴露全局的loader

使用方法

```
import $ from 'expose-loader?$!jquery'
```

webpack中的使用方法

```
rules: [
    {
        test: require.resolve('jquery'),
        use: 'expose-loader?$'
    },
]
```

##### 模块注入$

```
const webpack = require('webpack')
plugins: [
    new webpack.ProvidePlugin({
        $: 'jquery'
    })
]
```

忽略打包

```
externals: {
    jquery: '$'
}
```

#### 图片处理

##### 在js中创建图片

```
import logo from './logo.png'
let image = new Image()
image.src = logo
```

##### css中引入图片

```
div {
    width: 100px;
    height: 200px;
    background: url("./logo.png")
}
```

安装file-loader

```
npm i file-loader -D
```

配置webpack

```
{
	test: /\.(png|jpg|gif)$/,
	use: 'file-loader'
},
```

##### 在html中引入图片

安装依赖

```
npm i html-withimg-loader -D
```

配置webpack

```
{
    test:/\.html$/,
    use: 'html-withimg-loader'
},
```

##### 图片转base64避免发起http请求

安装依赖

```
npm i url-loader -D
```

配置webpack

```
{
    test: /\.(png|jpg|gif)/,
    use: {
      loader: 'url-loader',
      options: {
        limit: 200*1024, // 图片小于200k的时候转成base64
        outputPath: '/img/', // 输出在哪个文件夹下面
        publicPath: '' // 只要图片添加的地址 给某一个加cdn
      }
    }
 },
```

#### 打包多页面

```
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  mode: 'development',
  // 多入口
  entry: {
    home: './src/index.js',
    other: './src/other.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      chunks: ['home']  // 限制只引入homejs
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'other.html',
      chunks: ['other']
    }),
  ]
}
```

#### 配置source-map

**source-map**

源码映射，会单独生成一个sourcemap文件， 出错了，会标识当前报错的列和行大而全

**eval-source-map**

不会产生单独的文件，但是报错可以显示列和行

**cheap-module-source-map**

产生单独的映射文件，报错不显示列

**cheap-module-eval-source-map**

不产生单独的映射文件，报错不是不显示列

webpack配置

```
devtool: 'source-map'
```

#### 实时进行打包watch

- poll  每秒询问1000次
- aggregateTimeout 防抖 代码一直进行输入不进行打包
- ignored 忽略打包监控

```
watch: true,
watchOptions: { //监控选项
    poll: 1000, 
    aggregateTimeout: 500,
    ignored: /node_modules/
},
```

#### webpack小插件

**clean-webpack-plugin**

打包之前清除之前打包的文件

webpack配置

```
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

new CleanWebpackPlugin(),
```

**copy-webpack-plugin**

把文件复制到打包文件下面

webpack配置

```
const CopyWebpackPlugin = require('copy-webpack-plugin')

new CopyWebpackPlugin([
	{from: 'doc', to: ''}
]),
```

**BannerPlugin**

版权所有插件

webpack配置

```
const webpack = require('webpack');

new webpack.BannerPlugin('make 2019 by sufan')
```











