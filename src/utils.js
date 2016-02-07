'use strict';

const path = require('path');
const q = require('q');

function requireRoot(fileName) {
    console.log(__dirname, process.cwd());
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
    snakeToCamel
};
