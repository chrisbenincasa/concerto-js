(() => {
    "use strict";

    const Router = require('koa-router');
    const q = require('q');
    const fs = require('fs');
    const utils = require('../../utils');
    const UserPreferences = utils.requireRoot('./preferences/userPreferences');
    const ImportSession = require('../../import/ImportSession');
    const highland = require('highland');

    const readDirStream = highland.wrapCallback(fs.readdir);
    const statStream = highland.wrapCallback(fs.stat);

    const walkDirectory = function(directory) {
        return readDirStream(directory).
            flatMap(data => {
                return highland(data.map(entry => `${directory}/${entry}`));
            }).
            flatMap(file => {
                return statStream(file).map(statObj => {
                    return [file, statObj];
                });
            }).
            flatMap(fileAndStatObj => {
                let file = fileAndStatObj[0];
                let statObj = fileAndStatObj[1];
                if (statObj.isDirectory()) {
                    return walkDirectory(file);
                } else {
                    return highland([file]);
                }
            });
    };

    const streamToPromise = function(stream) {
        let defer = q.defer();
        try {
            stream.toArray(arr => defer.resolve(arr));
        } catch (e) {
            defer.reject(e);
        }

        return defer.promise;
    };

    module.exports = () => {
        const router = new Router({ prefix: '/preferences' });

        router.get('/', function *() {
            this.body = yield UserPreferences.getGlobalPreferences();
        });

        router.post('/', function *(next) {
            let body = this.request.body;
            //yield UserPreferences.saveGlobalPreferences(body);
            console.log(body)
            if (body.directory) {
                let pathsPromise = streamToPromise(walkDirectory(body.directory));
                pathsPromise.then(paths => {
                    let session = new ImportSession(null, null, paths);
                    session.run();
                });

                this.body = yield pathsPromise;
            }

            this.status = 200;
            yield next;
        });

        return router;
    };
})();