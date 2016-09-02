'use strict';

let babel      = require('gulp-babel'),
    buffer     = require('vinyl-buffer'),
    gulp       = require('gulp'),
    livereload = require('gulp-livereload'),
    pump       = require('pump'),
    rename     = require('gulp-rename'),
    rollup     = require('rollup-stream'),
    source     = require('vinyl-source-stream'),
    srcmaps    = require('gulp-sourcemaps'),
    uglify     = require('gulp-uglify');

module.exports = () => {
    gulp.task('build', ['build-min']);

    gulp.task('build-full', (callback) => {
        pump([
            rollup({
                entry: 'src/js/axiom.js',
                format: 'iife',
                sourceMap: true
            }),
            source('main.js', './src'),
            buffer(),
            srcmaps.init({ loadMaps: true }),
            srcmaps.write('./') ,
            gulp.dest('./dist'),
            livereload()
        ],
        callback);
    });

    gulp.task('build-min', ['build-full'], () => {
        return gulp.src('./dist/axiom.js')
            .pipe(babel({
                presets: ['es2015']
            }))
            .pipe(uglify())
            .pipe(rename('main.min.js'))
            .pipe(gulp.dest('./dist'));
    });
};
