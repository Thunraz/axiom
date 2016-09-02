'use strict';

let fs   = require('fs'),
    gulp = require('gulp'),
    pug  = require('pug');

function getJS() {
    return readFile('./dist/main.min.js');
}

function getCSS() {
    return readFile('./dist/main.css');
}

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

module.exports = () => {
    gulp.task('template', ['build', 'css'], (done) => {
        let ctx = {};

        getJS()
            .then(function(js) { ctx.js = js; })
            .then(() => getCSS())
            .then(function(css) { ctx.css = css; })
            .then(() => readFile('./src/index.pug'))
            .then((str) => {
                // Inline/minified index file
                let inlineResult = pug.compile(str)({ js: ctx.js, css: ctx.css });

                writeFile('./dist/index.min.html', inlineResult)
                    .then(() => {
                        // development index file
                        let result = pug.compile(str)();
                        return writeFile('./dist/index.html', result);
                    })
                    .then(done);  
            });
    });
};
