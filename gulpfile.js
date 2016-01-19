(function() {
    'use strict';

    var gulp = require('gulp'),
        electron = require('electron-prebuilt'),
        childProcess = require('child_process'),
        watchify = require('watchify'),
        gutil = require('gulp-util'),
        async = require('async'),
        q = require('q'),
        _ = require('underscore'),
        tap = require('gulp-tap'),
        build = require('./build.js'),
        webpack = require('webpack');

    //var production = process.env.NODE_ENV === 'production';
    var production = false;
    var productionImport = './webpack.config.' + (production ? 'production' : 'development') + '.js';

    var webpackPipe = function(watch, doneFunc) {
        var config = require(productionImport);
        config.watch = watch;

        var buildConfigs = _(build.configs).map(function(buildConfig) {
            return _.extend({}, config, buildConfig);
        });

        doneFunc = doneFunc || function() {};

        return webpack(buildConfigs, doneFunc);
    };

    gulp.task('webpack', function(cb) {
        return webpackPipe(false, function(err) {
            if (err) console.error(err);
            cb();
        });
    });

    gulp.task('webpack-dev-server', function(callback) {
        var config = require(productionImport);
        var WebpackDevServer = require('webpack-dev-server');
        config.devtool = "eval";
        config.debug = true;

        new WebpackDevServer(webpack(config), {
            stats: {
                colors: true
            }
        }).listen(8080, "localhost", function(err) {
            if (err) {
                console.error(err);
            }

            gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
        });

        callback();
    });

    gulp.task('launch', function(cb) {
        var once = true;
        webpackPipe(true, function() {
            if (once) {
                childProcess.spawn(electron, ['src/main.js'], {
                    stdio: 'inherit'
                }).on('exit', function() {
                    cb();
                    process.exit();
                });
                once = false;
            }
        });
    });
})();