(function() {
    "use strict";

    const fs = require('fs');
    const q = require('q');

    let globalPreferences;

    class UserPreferences {
        constructor(json) {
            this.raw = json;
            this.loaded = true;
        }

        static loadFromFile(filePath) {
            return q.denodeify(fs.readFile)(filePath, 'UTF-8').then((json) => {
                return new UserPreferences(json);
            });
        }

        static getGlobalPreferences() {
            if (!globalPreferences) {
                // TODO: Add file path
                return UserPreferences.loadFromFile('/Users/christianbenincasa/Desktop/prefs.json').then((json) => {
                    globalPreferences = json;
                    return json;
                });
            }

            return q.when(globalPreferences);
        }
    }

    module.exports = UserPreferences;
})();