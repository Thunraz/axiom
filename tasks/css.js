let cleanCSS   = require('gulp-clean-css'),
    concat     = require('gulp-concat-css'),
    gulp       = require('gulp'),
    livereload = require('gulp-livereload'),
    sass = require('gulp-sass');

module.exports = () => {
    gulp.task('css', function () {
        return gulp.src(['src/css/reset.css', 'src/css/**/*.scss'])
            .pipe(sass().on('error', sass.logError))
            .pipe(concat('main.css'))
            .pipe(cleanCSS())
            .pipe(gulp.dest('./dist'))
            .pipe(livereload());
    });
};
