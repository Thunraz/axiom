'use strict';

const gulp = require('gulp');

let tasks = ['build', 'css', 'template', 'watch', 'assets'];

// Bootstrap individual task files
tasks.forEach(
    (task) => require(`./tasks/${task}`)()
);

gulp.task('default', tasks.filter((x) => {return x != 'watch'}));