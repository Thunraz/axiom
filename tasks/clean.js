const clean = require('gulp-clean');
const gulp  = require('gulp');

export default () => gulp
    .src('./dist/*')
    .pipe(clean());
