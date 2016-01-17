(function() {
    "use strict";

    const fs = require('fs');
    const Q = require('q');

    let globalPreferences;

    class UserPreferences {
        constructor(json) {
            this.loaded = true;
        }

        static loadFromFile(filePath) {
            return Q.denodeify(fs.readFile)(filePath, 'UTF-8').then(function(json) {
                return new UserPreferences(json);
            });
        }

        static getGlobalPreferences() {
            if (!globalPreferences) {
                // TODO: Add file path
                globalPreferences = UserPreferences.loadFromFile('');
            }

            return globalPreferences;
        }
    }

    module.exports = UserPreferences;
})();