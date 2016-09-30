let gulp = require('gulp'),
    sass = require('gulp-sass');

module.exports = () => {
    gulp.task('css', function () {
        return gulp.src('src/sass/main.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest('./dist'));
    });
};
