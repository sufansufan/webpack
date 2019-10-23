const xhr = new XMLHttpRequest();

xhr.open('GET','/user', true);
xhr.onload = function() {
  console.log(xhr.response);
}

xhr.send();
// console.log('index')

// class Log {
//   constructor() {
//     console.log('出错了111')
//   }
// }
// let log = new Log()
