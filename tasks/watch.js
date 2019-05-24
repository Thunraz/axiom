import gulp from 'gulp';

function clearTerminal(done) {
    process.stdout.write('\x1B[2J\x1B[0f\u001b[0;0H');
    done();
}

export default () => gulp.watch(['src/*', 'src/**/*'], gulp.series(clearTerminal, 'compile'));
