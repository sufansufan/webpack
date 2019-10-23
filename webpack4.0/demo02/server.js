const express = require('express');
const webpack = require('webpack');
const app = express();

// 中间件
const middle = require('webpack-dev-middleware');

const config = require('./webpack.base.js/index.js');

const compiler =  webpack(config)

app.use(middle(compiler))

app.get('/user', (req, res) => {
  res.json({name: '苏凡123456'})
})

app.listen(3000);
