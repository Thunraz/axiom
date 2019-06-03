const gulp   = require('gulp');
const uglify = require('gulp-uglifycss');
const sass   = require('gulp-dart-sass');

export default () => gulp.src('src/sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(uglify({
        maxLineLen: 80,
    }))
    .pipe(gulp.dest('./dist'));
