(() => {
    "use strict";

    const Router = require('koa-router');
    const q = require('q');
    const UserPreferences = require('../../preferences/userPreferences');

    module.exports = () => {
        const router = new Router({ prefix: '/preferences' });

        router.get('/', function *() {
            console.log('preferences');
            yield this.render('preferences');
        });

        router.get('/current', function *() {
            this.body = yield UserPreferences.getGlobalPreferences().then((userPrefs) => {
                return userPrefs.raw;
            });
            this.set('Content-Type', 'application/json');
        });

        return router;
    };
})();