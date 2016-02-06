(function() {
    'use strict';

    var gulp = require('gulp'),
        electron = require('electron-prebuilt'),
        childProcess = require('child_process'),
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

    var webpackPipe = function(watch, watchOptions) {
        var deferred = q.defer();
        var config = require(productionImport);
        watchOptions = watchOptions || {};
        config.watch = watch;

        if (watch) {
            console.log('Watching webpack configuration...');
        }

        var buildConfigs = _(build.configs).map(function(buildConfig) {
            return _.extend({}, config, buildConfig);
        });

        var compiler = webpack(buildConfigs, function() {
            deferred.resolve({});
        });

        if (watch) {
            if (compiler.compilers) {
                compiler.compilers.forEach(function(c) {
                    var filename = c.options.output.filename.replace(/\[name]/, c.options.name);
                    c.watch(watchOptions, function(err, stats) {
                        var execTime = stats.endTime - stats.startTime;
                        console.log('Successfully recompiled bundle ' + filename + ' in ' + execTime + ' (ms).');
                    });
                });
            } else {
                var filename = compiler.options.output.filename.replace(/\[name]/, compiler.options.name);
                compiler.watch(watchOptions, function(err, stats) {
                    console.log('Successfully recompiled bundle ' + filename + '.');
                });
            }
        }


        return deferred.promise;
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
                console.error(err);
            }

            gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
        });

        callback();
    });

    gulp.task('launch', function() {
        var once = true;
        return webpackPipe(true).then(function() {
            var deferred = q.defer();

            if (once) {
                childProcess.spawn(electron, ['src/main.js'], { stdio: 'inherit' }).
                    on('exit', function() {
                        deferred.resolve();
                        process.exit();
                    });
                once = false;
            }

            return deferred.promise;
        });
    });
})();