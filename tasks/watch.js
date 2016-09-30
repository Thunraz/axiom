'use strict';

let gulp       = require('gulp'),
    http       = require('http'),
    path       = require('path'),
    st         = require('st');

module.exports = () => {
    gulp.task('watch', ['server'], () => {
        return gulp.watch(
            ['src/js/**/*.js', 'src/sass/**/*.s?ss', 'src/index.pug', 'src/assets/*.*'],
            ['build', 'css', 'template', 'assets']
        );
    });

    gulp.task('server', (done) => {
        http.createServer(
            st({ path: path.join(__dirname, '..', 'dist'), index: 'index.html', cache: false })
        ).listen(8080, done);
    });
};
