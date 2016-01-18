(function() {
    'use strict';

    var gulp = require('gulp'),
        electron = require('electron-prebuilt'),
        childProcess= require('child_process'),
        watchify = require('watchify'),
        source = require('vinyl-source-stream'),
        buffer = require('vinyl-buffer'),
        gutil = require('gulp-util'),
        async = require('async'),
        q = require('q'),
        _ = require('underscore'),
        build = require('./build.js');

    //var production = process.env.NODE_ENV === 'production';
    var production = false;
    var productionImport = './webpack.config.' + (production ? 'production' : 'development') + '.js';

    var webpack = require("webpack"),
        webpackStream = require('webpack-stream');

    var webpackPipe = function(watch, doneFunc) {
        var config = require(productionImport);

        config.watch = watch;

        doneFunc = doneFunc || function() {};

        var srcs = _.chain(build.bundles).map(function(bundle) {
            return _(bundle.in).values();
        }).flatten().value();

        return gulp.src(srcs).
            pipe(webpackStream(config, webpack, doneFunc)).
            pipe(gulp.dest('./dist'));
    };

    gulp.task('webpack', function() {
        return webpackPipe(false);
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
                throw new gutil.PluginError("webpack-dev-server", err);
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