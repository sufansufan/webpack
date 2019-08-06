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

#### 解决跨域问题

##### 有服务端进行代理

```
devServer: {
    port: 8081,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: {'/api': ''}
      }
    },
 },
```

##### 无服务端

```
devServer: {
    port: 8081,
    before(app) {
      app.get('/user', (req, res) => {
       	res.json({name: '苏凡123456'})
      })
    }
},
```

##### 有服务端不使用代理在服务端启动webpack端口共用

使用webpack-dev-middleware中间件

安装webpack-dev-middleware

```
npm i webpack-dev-middleware -D
```

```
const express = require('express');
const webpack = require('webpack');
const app = express();

// 中间件
const middle = require('webpack-dev-middleware');

const config = require('./webpack.config.js');

const compiler =  webpack(config)

app.use(middle(compiler))

app.get('/user', (req, res) => {
  res.json({name: '苏凡123456'})
})

app.listen(3000);

```

#### resolve属性的配置

对模块进行解析、第三方包

- modules 指定的解析模块 否则是同级一级一级查找
- alias 别名
- mainFields 如果没有指定别名或没有指定路径的话，此时走查询主入口的先后
- mainFiles 入口文件的名字index.js
- extensions 拓展名

```
resolve: {
	modules: [path.resovle('node_moduoles')],
	mainFields: ['style', 'main'],
	mainFiles: []，
	extensions: ['.js', 'css', '.json', '.vue']
	alias： {
        bootstrap: 'bootstrap/dist/css/bootstrap.css'
	}
}
```

#### 区分不同环境

安装webpack-merge

用户来合并配置信息

```
npm i -D webpack-merge
```

创建webpack.prod.js

```
let { smart } = require('webpack-merge')
const base = require('./webpack.base.js')

module.exports = smart(base, {
  mode: 'production'
})
```

创建webpack.dev.js

```
let { smart } = require('webpack-merge')
const base = require('./webpack.base.js')

module.exports = smart(base, {
  mode: 'development'
})
```

### webpack优化

#### noParse

不进行解析第三方依赖库

```
module: {
    noParse: /jquery/, //不去解析jquery中依赖库
    rules: [
      {
        test: /\.js$/,
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
```

#### IgnorePlugin

忽略加载那个包里面的插件,此时配置完以后需要手动加载对应的语言包

```
const webpack = require('webpack');

new webpack.IgnorePlugin(/\.\/locale/, /moment/),
```

#### DllPlugin

动态链接库（单独的进行打包）
列如单独打包`react ` 和 ` reacr-dom`

**配置webpack.config.react.js**

```
const path = require('path');
const webpack = require('webpack')
module.exports = {
  mode: 'development',
  entry: {
    react: ['react', 'react-dom']
  },
  output: {
    filename:'_dll_[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: '_dll_[name]',
    // libraryTarget: 'commonjs'  //var  umd
  },
  plugins: [
    new webpack.DllPlugin({
      name: '_dll_[name]',
      path: path.resolve(__dirname, 'dist', 'manifest.json')
    })
  ]
}
```

**配置webpack.config.js pugin**

```
new webpack.DllReferencePlugin({
	manifest: path.resolve(__dirname, 'dist', 'manifest.json')
}),
```

**注意** 需要先打包webpack.configr.react.js 否则程序将会报错

#### happypack

webpack实现多线程打包

安装happypack

```
npm i happypack
```

配置happpack

```
const Happypack = require('happypack');
module: {
    noParse: /jquery/, //不去解析jquery中依赖库
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: path.resolve('src'),
        use: 'Happypack/loader?id=js'  // 使用多线程进行打包
      }
    ]
},

plugins: [
    new Happypack ({
      id: 'js',
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
            '@babel/preset-react',
          ]
        }
      }]
    }),
]
```

#### webpack自带优化

**tree-shaking没有用的代码自动化删除** 

在生产环境下 会自动去除掉没有用的代码

import导入的话会自动去除没有用的代码。require导入的话会默认在一个对象下面即default，不支持自动去除掉无用的代码

**作用域提升**

```
let a = 1;
let b = 2;
let c = 3;
let d = a+b+c; // 在webpack中会自动省略，可以简化的代码
console.log(d)
```

#### 抽取公共代码

```
optimization: {
    splitChunks: { // 分割代码块
      cacheGroups: { // 缓存组
        common: {
          chunks: 'initial',
          minSize: 0,
          minChunks: 2,
        },
        vendor: { // 抽离第三方包 例如jquery
          priority: 1, //设置优先级
          test: /node_modules/,
          chunks: 'initial',
          minSize: 0,
          minChunks: 2,
        }
      }
    }
  },
```

#### 懒加载

**index.js**

```
let button = document.createElement('button')
button.innerHTML = 'hello'
// vue路由的懒加载 react路由加载
button.addEventListener('click', function() {
  //  es6草案中的语法 jsonp实现动态加载文件
  import ('./source').then(data => {
    console.log(data.default);
  });
})
document.body.appendChild(button);
```

**sourc.js**

~~~
export default 'sufan'
~~~

#### 热更新

~~~
devServer: {
    hot: true,
    port: 3000,
    open: true,
    contentBase: './dist'
 },
 plugins: [
    new webpack.NamedModulesPlugin(), // 打印模块更新的路径
    new webpack.HotModuleReplacementPlugin() // 热更新插件
 ]
~~~

**index.js**

~~~
import str from './source'
if(module.hot){
  module.hot.accept('./source', () => {
    let str = require('./source')
    console.log(str, 77777)
  })
}
~~~

#### tapable

**start.js**

~~~
let { SyncHook } = require('tapable')

class Lesson {
  constructor() {
    this.hooks = {
      arch: new SyncHook(['name']),
    }
  }
  tap() {
    this.hooks.arch.tap('node', function (name) {
      console.log('node', name);
    })
    this.hooks.arch.tap('react', function (name) {
      console.log('react', name)
    })
  }
  start() {
    this.hooks.arch.call('js');
  }
}

let l = new Lesson();
l.tap();
l.start();

~~~

**synchook的实现**

```
class SyncHook {
  constructor(args) { // args => ['name]
    this.tasks = [];
  }
  tap(name, task) {
    this.tasks.push(task)
  }
  call(...args) {
    this.tasks.forEach((item) => {
      item(...args)
    })
  }
}

let hook = new SyncHook(['name'])
hook.tap('react', function (name) {
  console.log('react', name);
})
hook.tap('node', function (name) {
  console.log('node', name);
})
hook.call('sufan')

```

