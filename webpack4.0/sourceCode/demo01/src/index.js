let fn = () => {
  console.log('2222222222')
}
fn()

@log
class A {
  a = 1
}

function log(target) {
  console.log(target)
}
require("@babel/polyfill");
require('./a.js')
require('./index.css')
require('./index.less')
