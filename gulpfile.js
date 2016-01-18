
(function() {
    'use strict';

    var gulp = require('gulp'),
        babel = require('gulp-babel'),
        eventStream = require('event-stream'),
        electron = require('electron-prebuilt'),
        childProcess= require('child_process'),
        browserify = require('browserify'),
        watchify = require('watchify'),
        source = require('vinyl-source-stream'),
        buffer = require('vinyl-buffer'),
        uglify = require('gulp-uglify'),
        sourcemaps = require('gulp-sourcemaps'),
        gutil = require('gulp-util'),
        livereload = require('gulp-livereload'),
        async = require('async'),
        q = require('q'),
        _ = require('underscore'),
        envify = require('envify/custom'),
        build = require('./build.js');

    //var production = process.env.NODE_ENV === 'production';
    var production = true;

    var getBundler = function(watch) {
        var defer = q.defer();

        async.map(build.bundles, function(bundle, cb) {
            var b = browserify({
                entries: bundle.in,
                debug: production,
                cache: watch ? {} : undefined,
                packageCache: watch ? {} : undefined,
                fullPaths: watch
            });

            if (watch) {
                b = watchify(b);
            }

            cb(null, {
                bundle: b,
                out: bundle.out
            });
        }, function(err, results) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(results);
            }
        });

        return defer.promise;
    };

    var doBundle = function(b) {
        var start = new Date().getTime();

        return b.bundle.
            transform('babelify', { presets: ["es2015", "react"] }).
            transform('envify', { NODE_ENV: 'production' }).
            bundle().
            pipe(source(b.out)).
            pipe(buffer()).
            pipe(sourcemaps.init({ loadMaps: true })).
            pipe(uglify()).
            on('error', gutil.log).
            pipe(sourcemaps.write('./')).
            pipe(gulp.dest('./dist/js/')).
            on('end', function() {
                var end = new Date().getTime();
                console.log('Completed bundle: \'' + b.out + '\' in ' + (end - start) + ' milliseconds.');
            });
    };

    gulp.task('launch', ['watch'], function(cb) {
        childProcess.spawn(electron, ['src/main.js'], {
            stdio: 'inherit'
        }).on('exit', function() {
            process.exit();
        });
    });

    gulp.task('javascript', function(cb) {
        getBundler(false).then(function(bundles) {
            eventStream.merge(
                bundles.map(function(bundle) { return doBundle(bundle); })
            ).on('end', cb);
        });
    });

    gulp.task('watch', function(cb) {
        getBundler(/** watch **/ true).then(function(bundles) {
            bundles.forEach(function(bundle) {
                bundle.bundle.on('update', _.debounce(function() {
                    doBundle(bundle);
                    console.log('Rebuilding bundle ' + bundle.out + '...');
                }, 200));
            });

            eventStream.merge(
                bundles.map(function(bundle) {
                    return doBundle(bundle)
                })
            ).on('end', cb);
        });
    });
})();