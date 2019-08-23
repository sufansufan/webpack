const fs = require('fs');
const path = require('path')
const babylon = require('babylon')
const traverse = require('@babel/traverse').default
const babelTypes = require('@babel/types')
const generator = require('@babel/generator').default
const ejs = require('ejs')
const { SyncHook } = require('tapable')
//  babylon 主要就是把源码 转换成ast
//  @babel/traverse
//  @babel/types
//  @babel/generator
class Compiler {
  constructor(config) {
    // entry output
    this.config = config;
    // 需要保存入口文件的路径
    this.entryId; // './src/index.js'
    // 需要保存所有的模块的依赖
    this.modules = {};
    this.entry = config.entry // 入口路径
    // 工作路径
    this.root = process.cwd()
    this.hooks = {
      entryOption: new SyncHook(),
      compile: new SyncHook(),
      afterCompile: new SyncHook(),
      afterPulgins: new SyncHook(),
      run: new SyncHook(),
      emit: new SyncHook(),
      done: new SyncHook()
    }
    // 如果传递了plugins参数
    let plugins = this.config.plugins;
    if(Array.isArray(plugins)){
      plugins.forEach(plugin => {
        plugin.apply(this)
      })
    }
    this.hooks.afterCompile.call()
  }
  getSource(modulePath) {
    let rules = this.config.module.rules;
    let content = fs.readFileSync(modulePath, 'utf8');
    for (let i = 0; i < rules.length; i++) {
      let {test, use} = rules[i]
      let len = use.length - 1
      if(test.test(modulePath)) {
        function normalLoader() {
          let loader = require(use[len--])
          content = loader(content)
          if(len >= 0){
            normalLoader()
          }
        }
        normalLoader()
      }
    }
    return content;
  }
  // 解析源码
  parse(source, parentPath) { // AST 解析语法树
    const ast = babylon.parse(source);
    const dependencies = []; //依赖的数组
    traverse(ast, {
      CallExpression(p) { // a() require() 代用表达式
        const node = p.node; //对应的节点
        if(node.callee.name === 'require'){
          node.callee.name = '__webpack_require__';
          let moduleName = node.arguments[0].value;  // 取到的就是模块的引用名字
          moduleName = moduleName + (path.extname(moduleName) ? '' : '.js');
          moduleName = './' + path.join(parentPath, moduleName);  // 'src/a.js'
          dependencies.push(moduleName)
          node.arguments = [babelTypes.stringLiteral(moduleName)];
        }
      }
    })
    let sourceCode = generator(ast).code;
    return {
      sourceCode,
      dependencies
    }
  }
  // 构建模块
  buildModule(modulePath, isEntry) {
    // 拿到模块的内容
    let source = this.getSource(modulePath);
    // 模块id modulePath  = modulePath - this.root
    let moduleName = './' + path.relative(this.root, modulePath); // src/index.js path.dirname(moduleName) => ./src
    if(isEntry) {
      this.entryId = moduleName
    }
    // 解析需要把source源码进行改造， 返回一个依赖列表
    const { sourceCode, dependencies } = this.parse(source, path.dirname(moduleName));
    this.modules[moduleName] = sourceCode
    dependencies.forEach(dep => { // 附模块加载
      this.buildModule(path.join(this.root, dep), false)
    })
  }
  emitFile() {
    // 用数据 渲染我们的模板
    // 拿到输出到那个目录下面 输出路径
    let main = path.join(this.config.output.path, this.config.output.filename);
    // 读取模板文件
    let templateStr = this.getSource(path.join(__dirname, 'main.ejs'))
    let code = ejs.render(
      templateStr, {entryId: this.entryId, modules: this.modules}
    )
    this.assets = {}
    // 资源中 路径对应的代码
    this.assets[main] = code;
    fs.writeFileSync(main, this.assets[main])
  }
  run() {
    this.hooks.run.call();
    // 执行 并创建模块的依赖关系
    this.hooks.compile.call();
    this.buildModule(
      path.resolve(this.root, this.entry), true
    )
    this.hooks.afterCompile.call();
    // 发射一个文件， 打包后的文件
    this.emitFile();
    this.hooks.emit.call();
    this.hooks.done.call();
  }
}

module.exports = Compiler
