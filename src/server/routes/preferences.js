(() => {
    "use strict";

    const Router = require('koa-router');
    const async = require('async');
    const q = require('q');
    const fs = require('fs');
    const _ = require('underscore');
    const AV = require('av');
    const mp3 = require('mp3');
    const flac = require('flac.js');

    const readDir = q.denodeify(fs.readdir);
    const stat = q.denodeify(fs.stat);
    const asyncMap = q.denodeify(async.map);

    const walkDirectory = function(directory) {
        return readDir(directory).then(data => {
            let paths = data.map(entry => `${directory}/${entry}`);
            return asyncMap(paths, (item, cb) => {
                stat(item).then(statObj => {
                    if (statObj.isDirectory()) {
                        walkDirectory(item).then(result => cb(null, result)).catch(err => cb(err));
                    } else if (statObj.isFile()) {
                        cb(null, item);
                    }
                });
            }).then(result => _(result).flatten());
        });
    };

    module.exports = () => {
        const router = new Router({ prefix: '/preferences' });

        router.get('/', function *() {
            yield this.render('preferences');
        });

        router.post('/', function *(next) {
            let body = this.request.body;
            if (body.chosenFilePath) {
                let res = yield walkDirectory(body.chosenFilePath);

                res.forEach((file) => {
                    let asset = AV.Asset.fromFile(file);

                    asset.get('metadata', (p) => {
                        console.log(p);
                    });
                });

                this.body = res;
            }

            this.status = 200;
            yield next;
        });

        return router;
    };
})();