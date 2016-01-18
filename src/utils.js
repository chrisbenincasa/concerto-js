const path = require('path');

function requireRoot(fileName) {
    console.log(__dirname, process.cwd());
    let abs = path.resolve(__dirname, fileName);
    return require(abs);
}

module.exports = {
    requireRoot: requireRoot
};
