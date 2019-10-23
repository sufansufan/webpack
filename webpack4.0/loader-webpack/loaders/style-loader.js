const loaderUtils = require('loader-utils');
function loader(source) {
  // 我们可以再style-loader导出一个脚本
  let str = `
    let style = document.createElement('style');
    style.innerHTML = ${JSON.stringify(source)}
    document.head.appendChild(style)
  `
  return str;
}
// 在style-loader上写了pitch 后面的都不走了
// style-loader less-loader!css-loader/./index.less
loader.pitch = function (remainingRequest) {
  // 让style-loader去处理cess-loader!less-loader/./index.less
  // loaderUtils.stringifyRequest 让绝对路径转化文相对路径
  // require路径， 返回的就是css-loader处理好的结果require(!!cess-loader!less-loader/./index.less)
  console.log(loaderUtils.stringifyRequest(this,'!!' + remainingRequest))
  let str = `
    let style = document.createElement('style');
    style.innerHTML = require(${loaderUtils.stringifyRequest(this,'!!' + remainingRequest)})
    document.head.appendChild(style)
  `
  return str;
}
module.exports = loader
