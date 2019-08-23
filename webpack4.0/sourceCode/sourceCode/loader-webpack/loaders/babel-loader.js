let babel = require('@babel/core');
let loaderUtils = require('loader-utils'); // loader一个工具类
function loader(source) { // this => loaderContext
  let options = loaderUtils.getOptions(this); // 拿到配置
  let cb = this.async(); // 异步的返回值
  babel.transform(source, {
    ...options,
    sourceMap: true,
    filename: this.resourcePath.split('/').pop()  //文件名 this.resourcePath打包的文件路径
  },function (err, result) {
    cb(err, result.code, result.map) // 异步
  })
  // console.log(options, 1234567)
  // return source
}
module.exports = loader
