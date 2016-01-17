const path = require('path');
const root = path.resolve(__dirname, '..');

function requireRoot(fileName) {
    let abs = path.resolve(root, fileName);
    return require(abs);
}

module.exports = {
    requireRoot: requireRoot
};
