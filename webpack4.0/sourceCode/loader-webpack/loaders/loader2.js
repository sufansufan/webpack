function loader(source) { // loader 参数就是源代码
  console.log('loader2')
  return source
}

module.exports = loader
