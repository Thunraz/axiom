'use strict';

let gulp = require('gulp');

module.exports = () => {
    gulp.task('assets', () => {
        return gulp.src(['src/assets/**/*.*'])
            .pipe(gulp.dest('dist/assets/'));
    });
};