let cleanCSS   = require('gulp-clean-css'),
    concat     = require('gulp-concat-css'),
    gulp       = require('gulp'),
    livereload = require('gulp-livereload');

module.exports = () => {
    gulp.task('css', function () {
        return gulp.src(['src/css/reset.css', 'src/css/**/*.css'])
            .pipe(concat('main.css'))
            .pipe(cleanCSS())
            .pipe(gulp.dest('./dist'))
            .pipe(livereload());
    });
};
