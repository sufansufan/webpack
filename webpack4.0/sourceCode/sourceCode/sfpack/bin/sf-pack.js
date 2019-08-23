#! /usr/bin/env node

// 需要找到当前执行的路径 需要拿到webpack.config.js

const path = require('path');
//  config 配置文件
const config = require(path.resolve('webpack.config.js'));
const Compiler = require('../lib/Compiler.js');
const compiler = new Compiler(config)
compiler.hooks.entryOption.call()
// 标识运行编译
compiler.run()
