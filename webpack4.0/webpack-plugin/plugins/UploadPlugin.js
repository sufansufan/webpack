const path = require('path');
const qiniu = require('qiniu');
class UploadePlugin {
  constructor(options) {
    let { bucket= '', domain= '', accessKey ='', secretKey= ''} = options
    let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    let putPolicy = new qinu.rs.PutPolicy({scope: bucket});
    this.uploadToken = putPolicy.uploadToken(mac);
    let config = new qiniu.conf.Config();
    this.formUploader = new qiniu.form_up.FormUploader(config);
    this.putExtra = new qiniu.form_up.putExtra();
  }
  apply(compiler) {
    compiler.hooks.afterEmit.tapPromise('UploadePlugin', (compilation) => {
      let assets = compilation.assets;
      let promises = [];
      Object.keys(assets).forEach(filename => {
        promises.push(this.upload(filename))
      })
      return Promist.all(promises)
    })
  }
  upload(filename) {
    return new Promise((resolve, reject) => {
      let localFile = path.resolve(__dirname, '../dist', filename)
      this.formUploader.putFile(this.uploadToken, filename, localFile, this.putExtra, function(respErr,
        respBody, respInfo) {
        if (respErr) {
          reject(respErr) ;
        }
        if (respInfo.statusCode == 200) {
          resolve(respBody)
        }
      });
    })
  }
}

module.exports = UploadePlugin
