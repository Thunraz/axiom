const gulp = require('gulp');

export default () => gulp.src([
    'src/assets/**/*',
    '!src/assets/shader/*',
    '!src/assets/shader',
]).pipe(gulp.dest('dist/assets/'));
