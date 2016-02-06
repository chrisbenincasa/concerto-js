/* eslint strict: 0 */
'use strict';

const path = require('path');
const webpack = require('webpack');

module.exports = {
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loader: 'babel',
            exclude: /node_modules/,
            query: {
                presets: ['es2015', 'react']
            }
        }]
    },
    output: {
        path: path.join(__dirname, 'dist'),
        chunkFilename: '[id].bundle.js',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
        packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main']
    },
    plugins: [
        //new webpack.DefinePlugin({ "global.GENTLY": false })
    ],
    externals: [
        // put your node 3rd party libraries which can't be built with webpack here (mysql, mongodb, and so on..)
    ]
};