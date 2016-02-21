'use strict';

const path = require('path');
const q = require('q');
const APP_ROOT = path.resolve(__dirname, '..');

function requireRoot(fileName) {
    let abs = path.resolve(__dirname, fileName);
    return require(abs);
}

function dashToCamel(str) {
    return str.split('-').map(r => r.charAt(0).toUpperCase() + r.substring(1)).join('');
}

function snakeToCamel(str) {
    return str.split('_').map(r => r.charAt(0).toUpperCase() + r.substring(1)).join('');
}

module.exports = {
    requireRoot,
    dashToCamel,
    snakeToCamel,
    SOURCE_ROOT: __dirname,
    APP_ROOT
};
