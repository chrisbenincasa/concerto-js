(() => {
    "use strict";

    const Router = require('koa-router');

    module.exports = () => {
        const router = new Router({ prefix: '/preferences' });

        router.get('/', function *() {
            console.log('preferences');
            yield this.render('preferences');
        });

        return router;
    };
})();