'use strict';

let gulp       = require('gulp'),
    http       = require('http'),
    livereload = require('gulp-livereload'),
    path       = require('path'),
    st         = require('st');

module.exports = () => {
    gulp.task('watch', ['server'], () => {
        livereload.listen();

        return gulp.watch(
            ['src/js/**/*.js', 'src/css/**/*.css', 'src/index.pug', 'src/assets/*.*'],
            ['build', 'css', 'template']
        );
    });

    gulp.task('server', (done) => {
        http.createServer(
            st({ path: path.join(__dirname, '..', 'dist'), index: 'index.html', cache: false })
        ).listen(8080, done);
    });
};
