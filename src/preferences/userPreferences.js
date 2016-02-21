(function() {
    "use strict";

    const UNIX_DIR_VAR = 'XDG_CONFIG_HOME';
    const UNIX_DIR_FALLBACK = '~/.config';
    const WINDOWS_DIR_VAR = 'APPDATA';
    const WINDOWS_DIR_FALLBACK = '~\\AppData\\Roaming';
    const MAC_DIR = '~/Library/Application Support';
    const CONFIG_FILENAME = 'config.yaml';
    const DEFAULT_FILENAME = 'config_default.yaml';

    const fs = require('fs');
    const q = require('q');
    const utils = require('../utils');
    const FOUR_SPACES = '    ';

    let globalPreferences;

    const readFile = q.denodeify(fs.readFile);
    const writeFile = q.denodeify(fs.writeFile);

    class UserPreferences {
        constructor(json) {
            this.raw = json;
            this.loaded = true;
        }

        applyChanges(newJson) {
            this.raw = newJson;
            return this;
        }

        static loadFromFile(filePath) {
            return readFile(filePath, 'UTF-8').then((json) => {
                return new UserPreferences(JSON.parse(json));
            });
        }

        static getGlobalPreferences() {
            if (!globalPreferences) {
                // TODO: Add file path
                return UserPreferences.loadFromFile(`${utils.APP_ROOT}/config.json`).then((json) => {
                    globalPreferences = json;
                    return json;
                });
            }

            return q.when(globalPreferences);
        }

        static saveGlobalPreferences(newJson) {
            let saveFileAsync = () => {
                return writeFile(`${utils.APP_ROOT}/config.json`, JSON.stringify(newJson, null, FOUR_SPACES));
            };

            let promise = globalPreferences ? q.when(globalPreferences) : UserPreferences.getGlobalPreferences();

            return promise.then(() => {
                return saveFileAsync();
            }).then(() => {
                return globalPreferences.applyChanges(newJson);
            });
        }
    }

    module.exports = UserPreferences;
})();