(function() {
    "use strict";

    const _ = require('underscore');
    const koa = require('koa');
    const router = require('koa-router')();
    const views = require('koa-views');
    const path = require('path');
    const app = koa();
    const viewPath = path.resolve(__dirname, '../views');
    let server;

    app.use(function *(next){
        var start = new Date;
        yield next;
        var ms = new Date - start;
        console.log('%s %s - %sms', this.method, this.url, ms);
    });

    app.use(views(viewPath));

    router.get('/', function *(next) {
        this.body = JSON.stringify({
            response: "hello",
            code: 200
        });
    });

    const libraryRouter = require('./routes/library')();

    router.use(libraryRouter.routes(), libraryRouter.allowedMethods());

    app.use(router.routes()).use(router.allowedMethods());

    module.exports = {
        run() {
            server = app.listen(3000);
        },
        restart() {
            if (server) {
                server.close();
            }

            this.run();
        }
    };
})();