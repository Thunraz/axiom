const gulp = require('gulp');
const fs   = require('fs');
const pug  = require('pug');
const gpug = require('gulp-pug-3');

function writeFile(fname, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(fname, data, (err) => {
            if (err) {
                return reject(err);
            }
            return resolve();
        });
    });
}

function readFile(fname) {
    return new Promise((resolve, reject) => {
        fs.readFile(fname, (err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(data.toString('utf8'));
        });
    });
}

function processViews() {
    return gulp.src('src/views/*.pug')
        .pipe(gpug())
        .pipe(gulp.dest('./dist/views/'));
}

function processIndex() {
    return readFile('./src/index.pug')
        .then((str) => {
            // development index file
            const locals = {
                
            };

            const result = pug.compile(str, { filename: './src/index.pug' })(locals);
            
            return writeFile('./dist/index.html', result);
        });
}

export default gulp.series(
    processIndex,
    processViews,
);
