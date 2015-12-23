
(function() {
    'use strict';

    var gulp = require('gulp'),
        babel = require('gulp-babel'),
        electron = require('electron-prebuilt'),
        childProcess= require('child_process'),
        browserify = require('browserify'),
        watchify = require('watchify'),
        source = require('vinyl-source-stream'),
        buffer = require('vinyl-buffer'),
        uglify = require('gulp-uglify'),
        sourcemaps = require('gulp-sourcemaps'),
        gutil = require('gulp-util'),
        livereload = require('gulp-livereload');

    var getBundler = function(watch) {
        var b = browserify({
            entries: './src/client/index.js',
            debug: true
        });

        if (watch) {
            b = watchify(b);
        }

        return b;
    };

    var doBundle = function(b) {
        return b.
            transform('babelify', {presets: ["es2015", "react"]}).
            bundle().
            pipe(source('app.js')).
            pipe(buffer()).
            pipe(sourcemaps.init({loadMaps: true})).
            pipe(uglify()).
            on('error', gutil.log).
            pipe(sourcemaps.write('./')).
            pipe(gulp.dest('./dist/js/'));
    };

    gulp.task('launch', ['watch'], function() {
        childProcess.spawn(electron, ['src/main.js'], {
            stdio: 'inherit'
        });
    });

    gulp.task('javascript', function() {
        return doBundle(getBundler());
    });

    gulp.task('watch', function() {
        var bundle = getBundler(true);

        bundle.on('update', function() {
            doBundle(bundle);
            console.log('doBundle...');
        });

        return doBundle(bundle);
    });
})();