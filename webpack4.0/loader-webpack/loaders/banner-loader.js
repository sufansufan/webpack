const loaderUtils = require('loader-utils');
const validateOptions = require('schema-utils'); // 引入一个检验的库
const fs = require('fs')
function loader(source) {
  this.cacheable && this.cacheable()
  // this.cacheable(false); // webpack 进行打包的时候都会启动缓存的 this.cacheable(false) 指不使用缓存重新进行打包
  let options = loaderUtils.getOptions(this);
  let cb = this.async()
  let schema = {
    type: 'object',
    properties: {
      text: {
        type: 'string'
      },
      filename: {
        type: 'string'
      }
    }
  }
  validateOptions(schema, options, 'banner-loader');
  if(options.filename) {
    this.addDependency(options.filename) // 实时监控打包文件， 实时监控依赖的变化
    fs.readFile(options.filename, 'utf8', function (err, data) {
      cb(err, `/**${data}**/${source}`)
    });
  }else {
    cb (null, `/**${options.text}**/${source}`)
  }
}

module.exports = loader
