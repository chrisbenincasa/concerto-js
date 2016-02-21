(function() {
    "use strict";

    const Router = require('koa-router');
    const utils = require('../../utils');
    const db = utils.requireRoot('./db');

    module.exports = function generateRoutes() {
        const router = new Router({ prefix: '/library' });

        router.get('/', function *() {
            yield this.render('library');
        });

        router.get('/songs', function *(next) {
            this.body = yield db.model.Item.findAll();
            this.status = 200;
            yield next;
        });

        return router;
    };
})();