const HtmlWebpackPlugin = require('html-webpack-plugin');
// 把外联的标签 变成内联的标签   需要修改标签的的样式
class InlineSourcePlugin {
  constructor({match}) {
    this.reg = match
  }
  // 处理某一个标签
  processTag(tag, compilation) {
    console.log(tag)
    let newTag, url;
    if(tag.tagName === 'link' && this.reg.test(tag.attributes.href)){
      newTag = {
        tagName: 'style',
        attributes: {type: 'text/css'}
      }
      url = tag.attributes.href
    }
    if(tag.tagName === 'script' && this.reg.test(tag.attributes.src)){
      newTag = {
        tagName: 'script',
        attributes: {type: 'application/javascript'}
      }
      url = tag.attributes.src
    }
    if(url) {
      newTag.innerHTML = compilation.assets[url].source(); // 文件的内容
      delete compilation.assets[url];
      return newTag
    }
    return tag
  }
  // 处理引入标签的数据
  processTags(data, compilation){
    let headTags = [];
    let bodyTags = [];
    data.headTags.forEach(headTag => {
      headTags.push(this.processTag(headTag, compilation));
    });
    data.bodyTags.forEach(bodyTag => {
      bodyTags.push(this.processTag(bodyTag, compilation));
    })
    return {...data, headTags, bodyTags}
  }
  apply(compiler) {
    // 要通过webpackPlugin来实现这个功能
    compiler.hooks.compilation.tap('InlineSourcePlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync('alterPlugin', (data, cb) => {
        data = this.processTags(data, compilation) // compilations.assets
        cb(null, data)
      })
    })
  }
}
module.exports = InlineSourcePlugin
