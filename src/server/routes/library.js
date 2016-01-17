(function() {
    "use strict";

    const Router = require('koa-router');

    module.exports = function generateRoutes() {
        const router = new Router({ prefix: '/library' });

        router.get('/', function *() {
            this.body = 'Hello from the library';
        });

        return router;
    };
})();