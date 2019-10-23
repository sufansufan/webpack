const path = require('path');
class p {
  apply(comiler){
    console.log('start', 111111111);
    comiler.hooks.emit.tap('emit', function() {
      console.log('emit',22222222222)
    })
  }
}
class p1 {
  apply(comiler) {
    comiler.hooks.afterCompile.tap('emit', function() {
      console.log('afterPlugin',3333333333)
    })
  }
}
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.less/,
        use: [
          path.resolve(__dirname, 'loader', 'style-loader'),
          path.resolve(__dirname, 'loader', 'less-loader')
        ]
      }

    ]
  },
  plugins: [
    new p(),
    new p1()
  ]
}
