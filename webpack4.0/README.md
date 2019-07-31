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

## webpack基础配置

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

















