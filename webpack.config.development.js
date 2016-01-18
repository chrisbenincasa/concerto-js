/* eslint strict: 0 */
'use strict';

const webpack = require('webpack');
const webpackTargetElectronRenderer = require('webpack-target-electron-renderer');
const baseConfig = require('./webpack.config.base');
const _ = require('underscore');

var config = _.extend({}, baseConfig);

config.debug = true;

config.devtool = 'cheap-module-eval-source-map';

config.output.publicPath = 'http://localhost:3000/dist/';

config.module.loaders.push({
    test: /^((?!\.module).)*\.css$/,
    loaders: [
        'style-loader',
        'css-loader'
    ]
}, {
    test: /\.module\.css$/,
    loaders: [
        'style-loader',
        'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!'
    ]
});


config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
        '__DEV__': true,
        'process.env': {
            'NODE_ENV': JSON.stringify('development')
        }
    }),
    new webpack.SourceMapDevToolPlugin()
);

//config.target = webpackTargetElectronRenderer(config);
config.target = 'electron';

module.exports = config;