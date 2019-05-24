const colors = require('ansi-colors');
const log    = require('fancy-log');
const clean   = require('gulp-clean');
const gulp    = require('gulp');
const uglify  = require('gulp-uglify-es').default;
const through = require('through2');
const zip     = require('gulp-zip');

function minifyJS() {
    return gulp
        .src('dist/app.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/temp'));
}

function copyDistFiles() {
    return gulp
        .src([
            './dist/*.css',
            './dist/index.html',
            './dist/views/**/*',
        ], { base: 'dist' })
        .pipe(gulp.dest('dist/temp/'));
}

function getZipSize(inKib) {
    return through.obj((file, encoding, callback) => {
        const filenameShort = file.path.split(/\/|\\/).pop();

        // Check if we're dealing with a file or a buffer
        const byteSize = file.stat ? file.stat.size : Buffer.byteLength(String(file.contents));
        
        let formattedSize = byteSize;
        if (inKib === true) {
            formattedSize /= 1024;
        }
        formattedSize = formattedSize.toLocaleString();
        formattedSize += inKib ? ' KiB' : ' B';

        log('Size', colors.cyan(filenameShort), ':', colors.magenta(formattedSize));

        callback(null, file);
    });
}

function createZip() {
    return gulp
        .src(['./dist/temp/*', './dist/temp/**/*'])
        .pipe(zip('dist.zip'))
        .pipe(gulp.dest('dist'))
        .pipe(getZipSize());
}

function deleteTempDir() {
    return gulp
        .src('./dist/temp')
        .pipe(clean());
}

export default gulp.series(
    minifyJS,
    copyDistFiles,
    createZip,
    deleteTempDir,
);
