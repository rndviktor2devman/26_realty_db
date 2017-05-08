var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './static/jsx/main.js',
    output: {
        path: path.resolve('static/js'),
        filename: 'bundle.js',
    },
    module:{
    loaders: [
        { test: /\.jsx?$/, loader: 'babel-loader', exclude: [/node_modules/, /public/] },
        {test : /\.css$/, loader: 'style!css!'}
    ]
  }
};
