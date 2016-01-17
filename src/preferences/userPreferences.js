(function() {
    "use strict";

    const fs = require('fs');
    const Q = require('q');

    var inner = Symbol();
    class UserPreferences {
        constructor(json) {
            this[inner] = json;
            this.loaded = true;
        }

        static loadFromFile(filePath) {
            return Q.denodeify(fs.readFile)(filePath, 'UTF-8').then(function(json) {
                return new UserPreferences(json);
            });
        }
    }

    module.exports = UserPreferences;
})();