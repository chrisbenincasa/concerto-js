(() => {
    "use strict";

    const Router = require('koa-router');
    const q = require('q');

    module.exports = () => {
        const router = new Router({ prefix: '/preferences' });

        router.get('/', function *() {
            yield this.render('preferences');
        });

        return router;
    };
})();