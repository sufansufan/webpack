// console.log('hello')
// 使用loader进行处理 例如inline-loader! 使用inline-loader进行处理
//  -！ 不会让文件 再去通过pre+normal 中的loader进行处理了
//  ! 没有nomal的loader
//  !! 什么都不要 只是使用inline-loader
// let str = require('-!inline-loader!./a.js');

// loader 默认是由两部分组成 pitchloader 和nomalloader
// 如果有返回值的话 pitchloader loader会在哪里有返回值会跳转到对应的nomalloader上面...

// class sf {
//   constructor() {
//     this.name = 'sufan'
//   }
//   getName() {
//     return this.name
//   }
// }

// let aa = new sf();
// console.log(aa.getName())

// import p from './aaaa.png';

// let img = document.createElement('img');
// img.src = p;
// document.body.appendChild(img)

import './index.less';
