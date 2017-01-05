'use strict';

let babel       = require('gulp-babel'),
    fs          = require('fs'),
    gulp        = require('gulp'),
    gutil       = require('gulp-util'),
    pkg         = require('../package.json'),
    rename      = require('gulp-rename'),
    rollup      = require('rollup').rollup;

module.exports = () => {
    gulp.task('build', ['build-min']);
    
    gulp.task('create-electron-package-json', () => {
        fs.mkdir('./dist/', (err) => {
            if(err) gutil.log(err.message);
            
            fs.writeFile(
                './dist/package.json',
                JSON.stringify({
                    name:    pkg.name,
                    version: pkg.version,
                    description: pkg.description,
                    author: pkg.author,
                    main: 'app.js',
                    devDependencies: {
                        electron: '^1.4.1'
                    },
                    build: {
                        appId: pkg.name,
                        mac: {
                            category: 'public.app-category.action-games'
                        },
                        win: {
                            iconUrl: 'https://runvs.io/favicon.png',
                            target: 'nsis'
                        },
                        nsis: {
                            oneClick: false
                        }
                    },
                    scripts: {
                        pack: 'build --dir',
                        dist: 'build'
                    }
                })
            );
        });
    });
    
    gulp.task('copy-libs', ['create-electron-package-json'], () => {
        return gulp
            .src([
                './node_modules/three/build/three.js',
                './node_modules/three/examples/js/controls/OrbitControls.js',
                './src/electron/app.js'
            ])
            .pipe(gulp.dest('./dist/'))
    });

    gulp.task('build-full', ['copy-libs'], () => {
        return rollup({
            entry: 'src/js/axiom.js',
            sourceMap: true,
            external: [
                'three'
            ]
        }).then(function(bundle) {
            return bundle.write({
                dest:  'dist/main.js',
                format: 'iife',
                globals: {
                    three: 'THREE'
                },
            });
        });
    });

    gulp.task('build-min', ['build-full'], () => {
        return gulp.src('./dist/main.js')
            .pipe(babel({
                presets: ['babili']
            }))
            .pipe(rename('main.min.js'))
            .pipe(gulp.dest('./dist'));
    });
};
