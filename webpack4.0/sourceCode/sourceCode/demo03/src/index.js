// let button = document.createElement('button')
// button.innerHTML = 'hello'
// // vue路由的懒加载 react路由加载
// button.addEventListener('click', function() {
//   import ('./source').then(data => {
//     console.log(data.default);
//   });
// })
// document.body.appendChild(button);

import str from './source'
if(module.hot){
  module.hot.accept('./source', () => {
    let str = require('./source')
    console.log(str, 77777)
  })
}
